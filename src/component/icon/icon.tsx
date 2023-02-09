import React from "react";
import LogoIcon from "../../assets/LogoIcon.png";

interface IconProps {
  src: string;
  alt: string;
  size?: number;
  classes?: string;
}

function Icon({ src, alt, size, classes }: IconProps) {
  return (
    <div>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={classes}
          width={size}
          height={size}
        />
      ) : (
        <img
          src={LogoIcon}
          alt={alt}
          className={classes}
          width={size}
          height={size}
        />
      )}
    </div>
  );
}

export default Icon;
