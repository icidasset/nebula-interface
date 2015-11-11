import { Component } from 'react';


class ComponentWithInfo extends Component {

  constructor(props) {
    super(props);
    this.setStartState(this.props);
  }


  componentWillReceiveProps(nextProps) {
    // reset
    this.setStartState(nextProps);
  }


  setStartState() {
    this.state = Object.assign({}, this.state, {
      info: [],
    });
  }


  setInfo(type, item) {
    const obj = { type: type, text: item.toString() };
    this.setState({ info: [obj] });
    // this.render();
  }

}


export default ComponentWithInfo;
