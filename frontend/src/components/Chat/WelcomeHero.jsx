import {
  BrainCircuit,
} from "lucide-react";

function WelcomeHero() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        flex
        items-center
        justify-center
        px-6
        pb-10
      "
    >

      <div className="text-center">

        {/* ====================================================
            AI ICON
        ==================================================== */}

        <div
          className="
            relative
            mx-auto
            mb-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-violet-400/10
            bg-violet-500/[0.055]
            text-violet-300
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-xl
              bg-violet-500/[0.06]
              blur-xl
            "
          />

          <BrainCircuit
            size={20}
            strokeWidth={1.8}
          />

        </div>

        {/* ====================================================
            TITLE
        ==================================================== */}

        <h2
          className="
            text-[13px]
            font-medium
            tracking-[-0.02em]
            text-slate-300
            sm:text-[14px]
          "
        >
          How can I help you study today?
        </h2>

        {/* ====================================================
            DESCRIPTION
        ==================================================== */}

        <p
          className="
            mx-auto
            mt-2
            max-w-[390px]
            text-[7px]
            leading-4
            text-slate-700
            sm:text-[8px]
          "
        >
          Ask questions, get explanations, and solve doubts
          from your study materials.
        </p>

      </div>

    </div>
  );
}

export default WelcomeHero;