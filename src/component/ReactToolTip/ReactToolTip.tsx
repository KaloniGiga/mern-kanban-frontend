import ReactTooltip, { Place } from "react-tooltip";

interface Props {
  id: string;
  place: Place;
}

const ReactToolTip = ({ id, place }: Props) => {
  return <ReactTooltip effect="solid" id={id} place={place} />;
};

export default ReactToolTip;
