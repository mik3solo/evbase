export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full select-none">
      <div className="relative h-full w-full">
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern
              id="pattern-icons"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(0)"
            >
              {/* Car Icon */}
              <path
                className="fill-current text-muted opacity-[0.15] dark:opacity-[0.1]"
                d="M7 19v-2h2v2H7Zm8 0v-2h2v2h-2Zm0.6-4q1.95 0 3.325-1.375T20.3 10.3q0-1.95-1.375-3.325T15.6 5.6q-1.95 0-3.325 1.375T10.9 10.3q0 1.95 1.375 3.325T15.6 15Zm0-2q-1.15 0-1.925-0.775T12.9 10.3q0-1.15 0.775-1.925T15.6 7.6q1.15 0 1.925 0.775T18.3 10.3q0 1.15-0.775 1.925T15.6 13Zm-8.6 2q1.95 0 3.325-1.375T11.7 10.3q0-1.95-1.375-3.325T7 5.6q-1.95 0-3.325 1.375T2.3 10.3q0 1.95 1.375 3.325T7 15Zm0-2q-1.15 0-1.925-0.775T4.3 10.3q0-1.15 0.775-1.925T7 7.6q1.15 0 1.925 0.775T9.7 10.3q0 1.15-0.775 1.925T7 13Z"
                transform="translate(50, 50) scale(2.5)"
              />
              {/* Plug Icon */}
              <path
                className="fill-current text-muted opacity-[0.15] dark:opacity-[0.1]"
                d="M12 20H8v-2h4v2Zm4-2v2h-2v-2h2Zm-2-6V8h2v4h-2Zm-4 0V8h2v4h-2Zm-4 0V8h2v4H6Zm12-1V9h2v2h-2Zm-16 0V9h2v2H2Zm16-5V4h-2v2h2Zm-16 0V4h2v2H2Zm8-3v2h-2V3h2Z"
                transform="translate(130, 130) scale(2.5)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-icons)" />
        </svg>
      </div>
    </div>
  )
}

