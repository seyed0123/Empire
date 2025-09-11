import styles from "./Button.module.scss";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick, onDoubleClick, disabled }: ButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      disabled={disabled}
      className={`button-13 ${styles.Button} ${disabled ? styles.Disabled : ""}`}
    >
      <span className="text">{label}</span>
      <span className="button-13-background"></span>
      <span className="button-13-border"></span>

      <svg style={{ position: "absolute" }} width="0" height="0">
        <filter id="remove-black-button-13" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -1 -1 -1 0 1"
            result="black-pixels"
          />
          <feComposite in="SourceGraphic" in2="black-pixels" operator="out" />
        </filter>
      </svg>
    </button>
  );
};

export default Button;
