import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from auth.hashing import (
    hash_password,
    verify_password,
)

from auth.jwt_handler import (
    create_access_token,
    create_password_reset_token,
    get_current_user,
    verify_password_reset_token,
)

from database.database import get_db
from database.models import User

from schemas.auth_schema import (
    UserRegister,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from services.email_service import (
    send_password_reset_email,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    """
    Register a new StudySphere user.
    """

    email = user.email.strip().lower()
    full_name = user.full_name.strip()

    # --------------------------------------------------------
    # Validate name
    # --------------------------------------------------------

    if not full_name:
        raise HTTPException(
            status_code=400,
            detail="Full name is required.",
        )

    # --------------------------------------------------------
    # Validate password
    # --------------------------------------------------------

    if len(user.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    # --------------------------------------------------------
    # Check existing email
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    new_user = User(
        full_name=full_name,
        email=email,
        password=hash_password(user.password),
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)

    except Exception as exc:
        db.rollback()

        print(
            "[REGISTER ERROR]",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to create your account.",
        )

    print(
        f"[REGISTER] User created successfully: {email}"
    )

    return {
        "success": True,
        "message": "User registered successfully.",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
        },
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Authenticate a StudySphere user.
    """

    email = user.email.strip().lower()

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        user.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "user_id": db_user.id,
        }
    )

    print(
        f"[LOGIN] Successful login: {email}"
    )

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
        },
    }


# ============================================================
# SWAGGER / OAUTH2 TOKEN
# ============================================================

@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2-compatible login endpoint for Swagger.
    """

    email = form_data.username.strip().lower()

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        form_data.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "user_id": db_user.id,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Return currently authenticated user.
    """

    return {
        "success": True,
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
        },
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Send a password reset email.

    For security reasons, the API always returns
    the same response whether the email exists or not.
    """

    # --------------------------------------------------------
    # Normalize email
    # --------------------------------------------------------

    email = request.email.strip().lower()

    print("")
    print("=" * 65)
    print("[PASSWORD RESET] New request")
    print(f"[PASSWORD RESET] Email received: {email}")
    print("=" * 65)

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # --------------------------------------------------------
    # Generic response
    # --------------------------------------------------------

    generic_response = {
        "success": True,
        "message": (
            "If an account exists for this email, "
            "a password reset link has been sent."
        ),
    }

    # --------------------------------------------------------
    # IMPORTANT DEBUG MESSAGE
    # --------------------------------------------------------

    if not user:

        print(
            f"[PASSWORD RESET] ❌ No account found for: {email}"
        )

        print(
            "[PASSWORD RESET] "
            "Check the email in the PostgreSQL users table."
        )

        print("=" * 65)
        print("")

        return generic_response

    print(
        f"[PASSWORD RESET] ✅ Account found"
    )

    print(
        f"[PASSWORD RESET] User ID: {user.id}"
    )

    print(
        f"[PASSWORD RESET] User email: {user.email}"
    )

    # --------------------------------------------------------
    # Create reset token
    # --------------------------------------------------------

    try:

        reset_token = create_password_reset_token(
            user.id
        )

        print(
            "[PASSWORD RESET] ✅ Reset token generated"
        )

    except Exception as exc:

        print(
            "[PASSWORD RESET] ❌ Token generation failed:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to create password reset request.",
        )

    # --------------------------------------------------------
    # Frontend URL
    # --------------------------------------------------------

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    ).strip().rstrip("/")

    if not frontend_url:
        frontend_url = "http://localhost:5173"

    print(
        f"[PASSWORD RESET] Frontend URL: {frontend_url}"
    )

    # --------------------------------------------------------
    # Reset link
    # --------------------------------------------------------

    reset_link = (
        f"{frontend_url}/reset-password"
        f"?token={reset_token}"
    )

    print(
        "[PASSWORD RESET] ✅ Reset link generated"
    )

    # NOTE:
    # We intentionally DO NOT print reset_link because
    # the token inside it is sensitive.

    # --------------------------------------------------------
    # Send email
    # --------------------------------------------------------

    try:

        print(
            "[PASSWORD RESET] 📧 Sending email..."
        )

        send_password_reset_email(
            recipient_email=user.email,
            reset_link=reset_link,
        )

        print(
            f"[PASSWORD RESET] ✅ Email sent successfully "
            f"to {user.email}"
        )

    except Exception as exc:

        print(
            "[PASSWORD RESET] ❌ Email sending failed"
        )

        print(
            "[PASSWORD RESET] Error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to send the password reset email. "
                "Please check your SMTP configuration."
            ),
        )

    print("=" * 65)
    print("")

    return generic_response


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Verify reset token and update user's password.
    """

    # --------------------------------------------------------
    # Token validation
    # --------------------------------------------------------

    token = request.token.strip()

    if not token:
        raise HTTPException(
            status_code=400,
            detail="Password reset token is required.",
        )

    # --------------------------------------------------------
    # Password validation
    # --------------------------------------------------------

    if not request.password:
        raise HTTPException(
            status_code=400,
            detail="Password is required.",
        )

    if len(request.password) < 8:
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least "
                "8 characters long."
            ),
        )

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match.",
        )

    # --------------------------------------------------------
    # Verify reset token
    # --------------------------------------------------------

    try:

        user_id = verify_password_reset_token(
            token
        )

    except Exception as exc:

        print(
            "[PASSWORD RESET] Token verification error:",
            repr(exc),
        )

        user_id = None

    if not user_id:

        raise HTTPException(
            status_code=400,
            detail=(
                "This password reset link is invalid "
                "or has expired."
            ),
        )

    print(
        f"[PASSWORD RESET] Valid token for user ID: {user_id}"
    )

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=400,
            detail="User account could not be found.",
        )

    # --------------------------------------------------------
    # Update password
    # --------------------------------------------------------

    try:

        user.password = hash_password(
            request.password
        )

        db.commit()

        print(
            f"[PASSWORD RESET] ✅ Password updated "
            f"for user ID: {user.id}"
        )

    except Exception as exc:

        db.rollback()

        print(
            "[PASSWORD RESET] Password update error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to update your password.",
        )

    # --------------------------------------------------------
    # Success
    # --------------------------------------------------------

    return {
        "success": True,
        "message": (
            "Password reset successfully. "
            "You can now sign in."
        ),
    }