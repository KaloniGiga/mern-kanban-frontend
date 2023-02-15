import React from "react";
import LogoIcon from "../../assets/LogoIcon.png";
import { CgProfile } from "react-icons/cg";
import { Cloudinary } from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {fill} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

interface AvatarProps {
  src?: string;
  alt?: string;
  size: string | number;
  styles?: Object;
  classes?: string;
  isAdmin?: boolean;
  onClick?: () => void;
}

function Avatar({
  src,
  alt,
  styles,
  classes,
  size,
  isAdmin,
  onClick,
}: AvatarProps) {


  const cloudName = import.meta.env.VITE_CLOUD_NAME;

  const cld = new Cloudinary({
       cloud: {
          cloudName: cloudName
       }
  })


  const myImage = cld.image(src); 
   

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
   myImage.resize(fill().width(String(size)).height(String(size))).roundCorners(byRadius(70));

  return (
    <div  onClick={onClick} className="rounded-full">
      {src ? (
        <AdvancedImage
          cldImg={myImage}
           
        />
      ) : (
        <CgProfile size={size} />
      )}
    </div>
  );
}

export default Avatar;
