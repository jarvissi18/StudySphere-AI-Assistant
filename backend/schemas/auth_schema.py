from pydantic import BaseModel, EmailStr


# ============================================================
# REGISTER
# ============================================================

class UserRegister(BaseModel):

    full_name: str
    email: EmailStr
    password: str


# ============================================================
# LOGIN
# ============================================================

class UserLogin(BaseModel):

    email: EmailStr
    password: str


# ============================================================
# FORGOT PASSWORD
# ============================================================

class ForgotPasswordRequest(BaseModel):

    email: EmailStr


# ============================================================
# RESET PASSWORD
# ============================================================

class ResetPasswordRequest(BaseModel):

    token: str
    password: str
    confirm_password: str


# ============================================================
# RESPONSE
# ============================================================

class UserResponse(BaseModel):

    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True