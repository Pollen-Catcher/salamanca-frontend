import PropTypes from "prop-types";
import { Container } from "./styles";

const Button = ({
  backgroundColor,
  hoverColor,
  width,
  height,
  children,
  onClick,
}) => {
  return (
    <Container
      backgroundColor={backgroundColor}
      hoverColor={hoverColor}
      width={width}
      height={height}
      onClick={onClick}
    >
      {children}
    </Container>
  );
};

Button.propTypes = {
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: "#108AC9",
  hoverColor: "",
  width: "200",
  height: "30",
  children: "",
  onClick: () => {
    console.log("Click");
  },
};

export default Button;
