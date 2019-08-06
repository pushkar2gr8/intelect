/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar
} from "react-native";
import MapView, { Polyline, AnimatedRegion } from "react-native-maps";
import SwipeUpDown from "react-native-swipe-up-down";
import { vehicleData } from "./vehicleData";
import haversine from "haversine";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = vehicleData[0].multi_geo[0].geocode.latitude;
const LONGITUDE = vehicleData[0].multi_geo[0].geocode.longitude;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyCIqtwxVlzYe4ZTJHgtJpHKCeT8OBo4rKQ";

class App extends Component {
  constructor(props) {
    super(props);
    this.mapView = null;

    this.state = {
      coords: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    const duration = 500;

    console.log("adad");

    if (this.state.coords !== nextProps.coords) {
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            nextProps.coords,
            duration
          );
        }
      } else {
        this.state.coords
          .timing({
            ...nextProps.coords,
            duration
          })
          .start();
      }
    }
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  CollapsedList = data => {
    return (
      <View style={[listStyles.cardContainer, { flexDirection: "row" }]}>
        <View
          style={{
            flex: 1,
            elevation: 1,
            backgroundColor: "#fff",
            justifyContent: "space-around"
          }}
        >
          <Text>{data._id}</Text>
          <Text
            style={{ fontSize: 20, color: "#75B099" }}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {data.tracker_id}
          </Text>
          <Text>67km/hr 12:21:56</Text>
          <Text>NH4, Kali Talai, Gujrat 389 160, India</Text>
        </View>
        <View
          style={{
            flex: 0.3,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <View
            style={{
              height: 20,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#6CCCA6",
              borderRadius: 5
            }}
          >
            <Text style={{ color: "#fff" }}>Good</Text>
          </View>
          <Image
            style={{ height: 24, width: 24 }}
            source={require("./checked.png")}
          />
        </View>
      </View>
    );
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={listStyles.cardContainer}>
        <View
          style={{
            flex: 1,
            elevation: 1,
            backgroundColor: "#fff",
            flexDirection: "row",
            padding: 10
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>{item._id}</Text>
            <Text
              style={{ fontSize: 20, color: "#75B099" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.tracker_id}
            </Text>
            <Text>67km/hr 12:21:56</Text>
            <Text>NH4, Kali Talai, Gujrat 389 160, India</Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "space-around"
            }}
          >
            <View
              style={{
                height: 20,
                width: 60,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#6CCCA6",
                borderRadius: 5
              }}
            >
              <Text style={{ color: "#fff" }}>Good</Text>
            </View>
            <Image
              style={{ height: 24, width: 24 }}
              source={require("./checked.png")}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MapView
          showUserLocation
          followUserLocation
          loadingEnabled
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          style={{
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width
          }}
          ref={c => (this.mapView = c)}
          onPress={this.onMapPress}
        >
          <MapView.Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coords}
          />
          {vehicleData.map((val, index) => {
            let coordinates = new Array();
            if (val.multi_geo != undefined) {
              val.multi_geo.map((coord, i) => {
                coordinates.push(coord.geocode);
              });
            }
            if (!!val.multi_geo) {
              return (
                <Polyline
                  key={index}
                  coordinates={coordinates}
                  strokeColor="red"
                  strokeWidth={5}
                />
              );
            }
          })}
        </MapView>
        <SwipeUpDown
          swipeHeight={150}
          animation={"easeInEaseOut"}
          itemMini={this.CollapsedList(vehicleData[0])} // Pass props component when collapsed
          itemFull={
            <FlatList
              data={vehicleData}
              renderItem={data => this.renderItem(data)}
              keyExtractor={(item, index) => "list" + index}
            />
          } // Pass props component when show full
          disablePressToShow={true} // Press item mini to show full
          style={{
            position: "absolute",
            zIndex: 999,
            backgroundColor: "transparent"
          }}
        />
      </SafeAreaView>
    );
  }
}

const listStyles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 8,
    margin: 5,
    paddingLeft: 10,
    backgroundColor: "#6CCCA6"
  }
});

export default App;
