'use strict';

const {createElement, Component} = React || {};

class BlockSetPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tipText: null,
			changeResult: null,
		}
	}

	componentDidMount() {
		chrome.runtime.sendMessage({
			method: 'getBlockMessage',
		}, (response) => {
			const {blockMessage} = response;

			this.setState({tipText: blockMessage || null, changeResult: null});
		});
	}

	render() {
		return createElement('div', {},
		  [
			  createElement('div', {
				  style: {
					  fontSize: '24px',
					  lineHeight: 1.71,
					  fontWeight: 'bold',
					  color: 'rgb(38,38,38)',
					  minWidth: '109px'
				  }
			  }, '设置拦截文本：'),
			  createElement('div', {
				  style: {
					  fontSize: '14px',
					  lineHeight: 1.71,
					  color: 'rgb(166,166,166)',
				  }
			  }, '该文本会在网页被拦截的时候显示，作为提示'),
			  createElement('textarea', {
					style: {
						width: '700px',
						height: '100px',
						outline: 'none',
						marginTop: '10px',
						resize: 'none',
						padding: '15px',
						border: '1px solid #0170fe',
						borderRadius: '12px',
						boxShadow: 'rgb(255,255,255) 0px 0px 3pt 2pt'
					},
					rows: 4,
					cols: 50,
					value: this.state.tipText,
					onChange: e => {
						const v = e.target.value;
						this.setState({tipText: v, changeResult: null})
					}
				},
			  ),
			  createElement('div', {
				  style: {
					  background: 'rgb(60,193,150)',
					  fontSize: '14px',
					  fontWeight: 'bold',
					  marginTop: '10px',
					  color: 'white',
					  display: 'block',
					  padding: '12px 24px',
					  borderRadius: '8px',
					  width: 'fit-content',
					  cursor: 'pointer'
				  },
				  onClick: () => {
					  chrome.runtime.sendMessage({
						  method: 'setBlockMessage',
						  blockMessage: this.state.tipText
					  }, (response) => {
						  console.log('response for setBlockMessage', response);
						  this.setState({changeResult: response ? response.success : null})
					  });
				  }
			  }, '保存拦截文本'),
			  createElement('div', {
				  style: {
					  color: '#faad14',
					  fontSize: '12px',
					  marginTop: '10px'
				  }
			  }, this.state.changeResult ? '修改成功' : null)
		  ]
		);
	}
}

class RewritePanel extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return createElement('div', {}, ['rewrite']);
	}
}


class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return createElement(
		  'div',
		  {
			  style: {
				  display: 'flex',
				  justifyContent: 'flex-start',
				  alignItems: 'center',
				  height: '100%',
				  padding: '12px',
			  }
		  },
		  [
			  createElement('img', {
				  src: "./images/stop.png",
				  style: {
					  width: '40px',
					  height: '40px'
				  }
			  }),
			  createElement('div', {
				  style: {
					  marginLeft: '10px',
					  fontSize: '24px',
					  fontWeight: 'bold'
				  }
			  }, '注意力')
		  ]
		);
	}
}

class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeValue: props.defaultActive
		}
	}

	render() {
		const {list} = this.props;
		const {activeValue} = this.state;

		const childrenEle = Array.isArray(list) ? list.map(i => {
			const {name, value, cbForClick} = i || {};
			return createElement(
			  'div',
			  {
				  key: value,
				  onClick: () => {
					  this.setState({activeValue: value});
					  if (typeof cbForClick === 'function') {
						  cbForClick(value)
					  }
				  },
				  style: {
					  fontSize: '14px',
					  fontWeight: 'bold',
					  color: 'rgb(33, 33, 33)',
					  height: '48px',
					  lineHeight: '24px',
					  padding: '14px',
					  backgroundColor: activeValue === value ? 'rgb(245,245,245)' : 'rgb(255,255,255)',
					  borderRadius: activeValue === value ? '8px' : 0,
					  cursor: 'pointer',
					  boxSizing: 'border-box'
				  }
			  },
			  name
			);
		}) : [];

		return createElement(
		  'div',
		  {
			  style: {
				  padding: '12px'
			  }
		  },
		  childrenEle
		);
	}
}

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeValue: 'block',
			settingPanel: BlockSetPanel
		};
	}

	render() {
		const menuList = [{
			name: '拦截设置',
			value: 'block',
			cbForClick: (value) => {
				this.setState({
					activeValue: value,
					settingPanel: BlockSetPanel
				});
			}
		}, {
			name: '重定向设置',
			value: 'rewrite',
			cbForClick: (value) => {
				this.setState({
					activeValue: value,
					settingPanel: RewritePanel
				});
			}
		}]

		return createElement(
		  'div',
		  {
			  style: {
				  width: '100%',
				  height: '100%',
				  display: 'flex',
				  flexDirection: 'column',
				  justifyContent: 'center',
				  alignItems: 'center'
			  }
		  },
		  [
			  createElement(
				'div',
				{
					style: {
						width: '100%',
						height: '65px',
						borderBottom: '1px solid rgb(238,238,238)'
					}
				},
				[createElement(Header)]
			  ),
			  createElement(
				'div',
				{
					style: {
						width: '100%',
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}
				},
				[
					createElement('div',
					  {
						  style: {
							  width: '260px',
							  height: '100%',
							  background: 'rgb(255,255,255)',
							  borderRight: '1px solid rgb(238,238,238)'
						  }
					  },
					  [createElement(Menu, {list: menuList, defaultActive: this.state.activeValue})]
					),
					createElement('div', {style: {width: '100%', height: '100%', padding: '56px'}},
					  [
						  this.state.settingPanel ? createElement(this.state.settingPanel) : null
					  ]
					),
				]
			  ),
		  ]
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return createElement(Layout)
	}
}

const domContainer = document.querySelector('#root');

ReactDOM.render(createElement(App), domContainer);

