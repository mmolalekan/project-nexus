export const ButtonStatus = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2930_1319)">
        <path
          d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00001C14.6668 4.31811 11.6821 1.33334 8.00016 1.33334C4.31826 1.33334 1.3335 4.31811 1.3335 8.00001C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
          stroke="#CB1A14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.33334V8.00001"
          stroke="#CB1A14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.6667H8.00667"
          stroke="#CB1A14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2930_1319">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const LoadingState = () => {
  return (
    <svg
      width="24"
      height="24"
      stroke="#fff"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="1.5s"
            calcMode="spline"
            values="0 150;42 150;42 150;42 150"
            keyTimes="0;0.475;0.95;1"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5s"
            calcMode="spline"
            values="0;-16;-59;-59"
            keyTimes="0;0.475;0.95;1"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            repeatCount="indefinite"
          />
        </circle>
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="2s"
          values="0 12 12;360 12 12"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
};

export const PageLoadingState = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
    >
      <circle
        fill="none"
        strokeOpacity="1"
        stroke="#0d5eba"
        strokeWidth=".5"
        cx="250"
        cy="250"
        r="0"
      >
        <animate
          attributeName="r"
          calcMode="spline"
          dur="2s"
          values="1;240"
          keyTimes="0;1"
          keySplines="0 .2 .5 1"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="stroke-width"
          calcMode="spline"
          dur="2s"
          values="0;25"
          keyTimes="0;1"
          keySplines="0 .2 .5 1"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="stroke-opacity"
          calcMode="spline"
          dur="2s"
          values="1;0"
          keyTimes="0;1"
          keySplines="0 .2 .5 1"
          repeatCount="indefinite"
        ></animate>
      </circle>
    </svg>
  );
};

export const VerifiedIcon = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M89.7565 8.85472C95.6389 3.7698 104.361 3.7698 110.244 8.85472C114.417 12.4622 120.18 13.6085 125.416 11.8727C132.797 9.42598 140.855 12.7638 144.344 19.7128C146.819 24.6426 151.704 27.9072 157.206 28.3073C164.961 28.8712 171.129 35.0387 171.693 42.7938C172.093 48.2956 175.357 53.1813 180.287 55.6564C187.236 59.1452 190.574 67.2034 188.127 74.584C186.391 79.8201 187.538 85.5832 191.145 89.7565C196.23 95.6389 196.23 104.361 191.145 110.244C187.538 114.417 186.391 120.18 188.127 125.416C190.574 132.797 187.236 140.855 180.287 144.344C175.357 146.819 172.093 151.704 171.693 157.206C171.129 164.961 164.961 171.129 157.206 171.693C151.704 172.093 146.819 175.357 144.344 180.287C140.855 187.236 132.797 190.574 125.416 188.127C120.18 186.391 114.417 187.538 110.244 191.145C104.361 196.23 95.6389 196.23 89.7565 191.145C85.5832 187.538 79.8201 186.391 74.584 188.127C67.2034 190.574 59.1452 187.236 55.6564 180.287C53.1813 175.357 48.2956 172.093 42.7938 171.693C35.0387 171.129 28.8712 164.961 28.3073 157.206C27.9072 151.704 24.6426 146.819 19.7128 144.344C12.7638 140.855 9.42598 132.797 11.8727 125.416C13.6085 120.18 12.4622 114.417 8.85472 110.244C3.7698 104.361 3.7698 95.6389 8.85472 89.7565C12.4622 85.5832 13.6085 79.8201 11.8727 74.584C9.42598 67.2034 12.7638 59.1452 19.7128 55.6564C24.6426 53.1813 27.9072 48.2956 28.3073 42.7938C28.8712 35.0387 35.0387 28.8712 42.7938 28.3073C48.2956 27.9072 53.1813 24.6426 55.6564 19.7128C59.1452 12.7638 67.2034 9.42598 74.584 11.8727C79.8201 13.6085 85.5832 12.4622 89.7565 8.85472Z"
        fill="#0098CC"
      />
      <g filter="url(#filter0_d_633_1724)">
        <circle cx="100" cy="100" r="71.8593" fill="#FEF3E6" />
      </g>
      <path
        d="M77.3872 100.503L92.4668 115.578L122.613 85.4271"
        stroke="#0098CC"
        strokeWidth="6.03015"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_633_1724"
          x="24.1206"
          y="28.1407"
          width="151.759"
          height="151.759"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4.0201" />
          <feGaussianBlur stdDeviation="2.01005" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_633_1724"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_633_1724"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const FailedIcon = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M89.7565 8.85472C95.6389 3.7698 104.361 3.7698 110.244 8.85472C114.417 12.4622 120.18 13.6085 125.416 11.8727C132.797 9.42598 140.855 12.7638 144.344 19.7128C146.819 24.6426 151.704 27.9072 157.206 28.3073C164.961 28.8712 171.129 35.0387 171.693 42.7938C172.093 48.2956 175.357 53.1813 180.287 55.6564C187.236 59.1452 190.574 67.2034 188.127 74.584C186.391 79.8201 187.538 85.5832 191.145 89.7565C196.23 95.6389 196.23 104.361 191.145 110.244C187.538 114.417 186.391 120.18 188.127 125.416C190.574 132.797 187.236 140.855 180.287 144.344C175.357 146.819 172.093 151.704 171.693 157.206C171.129 164.961 164.961 171.129 157.206 171.693C151.704 172.093 146.819 175.357 144.344 180.287C140.855 187.236 132.797 190.574 125.416 188.127C120.18 186.391 114.417 187.538 110.244 191.145C104.361 196.23 95.6389 196.23 89.7565 191.145C85.5832 187.538 79.8201 186.391 74.584 188.127C67.2034 190.574 59.1452 187.236 55.6564 180.287C53.1813 175.357 48.2956 172.093 42.7938 171.693C35.0387 171.129 28.8712 164.961 28.3073 157.206C27.9072 151.704 24.6426 146.819 19.7128 144.344C12.7638 140.855 9.42598 132.797 11.8727 125.416C13.6085 120.18 12.4622 114.417 8.85472 110.244C3.7698 104.361 3.7698 95.6389 8.85472 89.7565C12.4622 85.5832 13.6085 79.8201 11.8727 74.584C9.42598 67.2034 12.7638 59.1452 19.7128 55.6564C24.6426 53.1813 27.9072 48.2956 28.3073 42.7938C28.8712 35.0387 35.0387 28.8712 42.7938 28.3073C48.2956 27.9072 53.1813 24.6426 55.6564 19.7128C59.1452 12.7638 67.2034 9.42598 74.584 11.8727C79.8201 13.6085 85.5832 12.4622 89.7565 8.85472Z"
        fill="#F26464"
      />
      <g filter="url(#filter0_d_633_1724)">
        <circle cx="100" cy="100" r="71.8593" fill="#FFF2F2" />
      </g>
      {/* Red "X" icon */}
      <path
        d="M80 80L120 120M120 80L80 120"
        stroke="#F26464"
        strokeWidth="6.03015"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_633_1724"
          x="24.1206"
          y="28.1407"
          width="151.759"
          height="151.759"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4.0201" />
          <feGaussianBlur stdDeviation="2.01005" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_633_1724"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_633_1724"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
