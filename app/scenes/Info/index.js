import React, { Component, PropTypes } from 'react';
import {
	Image,
	LayoutAnimation,
	PixelRatio,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import moment from 'moment';

import { TIME_FORMAT } from '../../constants';
import Avatar from '../../components/Avatar';
import ListTitle from '../../components/ListTitle';
import Scene from '../../components/Scene';

import { list as organiserList } from '../../data/organisers';
import theme from '../../theme';
import { attemptToOpenUrl } from '../../utils';

import CodeOfConduct from './components/CodeOfConduct';
import Organiser from './components/Organiser';

const mapHeight = 240;
const mapLocation = 'Santa+Clara,+California';

class Info extends Component {
	constructor (props) {
		super(props);

		this.getDimensions = this.getDimensions.bind(this);
		this.toggleCodeOfConduct = this.toggleCodeOfConduct.bind(this);

		this.state = {
			codeOfConductIsOpen: false,
		};
	}
	getDimensions (event) {
		let { width } = event.nativeEvent.layout;
		this.setState({ deviceWidth: width });
	}
	toggleCodeOfConduct () {
		LayoutAnimation.easeInEaseOut();
		this.setState({ codeOfConductIsOpen: !this.state.codeOfConductIsOpen });
	}
	openMap () {
		const latlong = [37.354108, -121.955236]; // Santa Clara, California
		const url = `http://maps.apple.com/?ll=${latlong.join()}`;

		attemptToOpenUrl(url);
	}
	openThinkmill () {
		const url = 'https://www.thinkmill.com.au';

		attemptToOpenUrl(url);
	}
	render () {
		const { navigator, organisers } = this.props;
		const { codeOfConductIsOpen, deviceWidth } = this.state;
		const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapLocation}&zoom=13&scale=2&size=${deviceWidth}x${mapHeight}&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C${mapLocation}`;

		return (
			<Scene scroll onLayout={this.getDimensions}>
				<TouchableOpacity onPress={this.openMap} style={styles.mapButton} activeOpacity={0.75}>
					<Image
						source={{ uri: staticMapUrl }}
						style={styles.mapImage}
					/>
				</TouchableOpacity>

				<ScrollView style={{ flex: 1 }}>
					<View style={styles.hero}>
						<Text style={styles.heroText}>
							The conference will be taking place on February 22nd and 23rd, with talks from 10am to 6pm each day. Plan to hang out with us each evening for plenty of socializing over food and drink
						</Text>
						<TouchableOpacity onPress={this.toggleCodeOfConduct} activeOpacity={0.75}>
							<Text style={styles.heroLink}>
								Code of Conduct
							</Text>
						</TouchableOpacity>
						{!!codeOfConductIsOpen && <CodeOfConduct onClose={this.toggleCodeOfConduct} />}
					</View>

					<ListTitle text="Organisers" />
					{organisers.map((organiser, idx) => {
						const onPress = () => {};

						return (
							<Organiser
								avatar={organiser.avatar}
								key={idx}
								onPress={() => {}}
								name={organiser.name}
								summary={organiser.summary}
							/>
						);
					})}

					<View style={styles.madeby}>
						<TouchableOpacity onPress={this.openThinkmill} activeOpacity={0.75} style={styles.madebyLink}>
							<Image
								source={require('./images/thinkmill-logo.png')}
								style={{ width: 100, height: 100 }}
							/>
							<Text style={[styles.madebyText, styles.madebyTitle]}>Made by Thinkmill</Text>
						</TouchableOpacity>
						<Text style={styles.madebyText}>
							We provide design & development expertise on-tap to help you build and ship your next digital product, platform, or app.
						</Text>
					</View>
				</ScrollView>
			</Scene>
		);
	}
};

Info.propTypes = {
	navigator: PropTypes.object.isRequired,
	organisers: PropTypes.array.isRequired,
};
Info.defaultProps = {
	organisers: organiserList,
};

const styles = StyleSheet.create({
	// map
	mapButton: {
		backgroundColor: theme.color.gray05,
		height: mapHeight,
	},
	mapImage: {
		height: mapHeight,
	},

	// hero
	hero: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: theme.color.gray20,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderTopColor: theme.color.gray30,
		borderTopWidth: 1 / PixelRatio.get(),
		paddingHorizontal: theme.fontSize.default,
		paddingTop: theme.fontSize.xlarge,
	},
	heroText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
		textAlign: 'center',
	},
	heroLink: {
		color: theme.color.blue,
		fontSize: theme.fontSize.default,
		fontWeight: '500',
		padding: theme.fontSize.large,
	},

	// made by thinkmill
	madeby: {
		alignItems: 'center',
		paddingHorizontal: theme.fontSize.default,
		paddingVertical: theme.fontSize.xlarge,
	},
	madebyLink: {
		alignItems: 'center',
	},
	madebyText: {
		fontSize: theme.fontSize.default,
		fontWeight: '300',
		lineHeight: theme.fontSize.large,
		marginTop: theme.fontSize.default,
		textAlign: 'center',
	},
	madebyTitle: {
		fontWeight: '500',
	},
});

module.exports = Info;
