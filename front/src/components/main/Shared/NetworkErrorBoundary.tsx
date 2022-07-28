import { Component, ErrorInfo, ReactNode } from "react";
import { NetworkError } from "../../../classes/customEvents";

//TODO not yet working.
export class NetworkErrorBoundary extends Component {
  state: { hasError: boolean; details?: Response };
  props: { children: ReactNode };

  constructor(props: { children: ReactNode }) {
    super(props);

    this.props = props;
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, _: ErrorInfo) {
    console.log("catch");
    this.setState({
      hasError: true,
      details: error instanceof NetworkError ? error.details : undefined,
    });
  }

  render = () =>
    this.state.hasError ? <h1> Something went wrong.</h1> : this.props.children;
}
