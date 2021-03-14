import mapboxgl from 'mapbox-gl';
import {colorBoundaries} from "./mapFunction";
import './Map.css';
import React, {useRef, useEffect} from 'react';

const Map = ({countryCode, countries, capitals}) => {
  const mapContainer = useRef();
  let capitalCoordinates;
  let countryName;
  let countryCoordinates;
  let currentLanguage = 'RU' //// comment: заменить на данные из контекста

  const getCountriesCoordinates = () => {
    countries.features.forEach(country => {
      if(country.properties.ISO_A2 == countryCode) {
        countryCoordinates = country.geometry.coordinates; 
      }
    })
  }

  const getCapitalCoordinates = () => {
    capitals.forEach(country => {
      if(country.CountryCode == countryCode) {
        capitalCoordinates = [country.CapitalLongitude, country.CapitalLatitude]; //longitude , lattitude
        countryName = country.CountryName;
      }
    })
  }

  useEffect(() => {
    const language = 'name_' + currentLanguage.toLocaleLowerCase();
    getCountriesCoordinates()
    getCapitalCoordinates()

    mapboxgl.accessToken = "pk.eyJ1Ijoic2Fmd29vZCIsImEiOiJja20wemV3djgxeDFwMnZtdzNlcmRmbnNqIn0.X8mmN1JOEEHQjSZ0I8_ChA";
    const map = new mapboxgl.Map ({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: capitalCoordinates || countryCoordinates[0][0][0], 
      zoom: 4
    })

    const nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true
    })

    const el = document.createElement('div');
    el.className = 'marker';

    if(capitalCoordinates) {
      new mapboxgl.Marker(el) 
      .setLngLat(capitalCoordinates)
      .addTo(map)
    }
    
    map.addControl(nav, 'bottom-right');
    map.addControl(new mapboxgl.FullscreenControl());
  
    map.on('load', function() {
      map.setLayoutProperty('country-label', 'text-field', ['get', language])
    })
    
    colorBoundaries(map, countryCoordinates, countryName, capitalCoordinates)

    return () => {
      map.remove();
    }
  }, [])

  return (
    <div className="Мap-container">
      <div className="Map-wrapper">
        <div className="Map" ref={mapContainer} />
        <div>Карта</div>
      </div>
    </div>
  )
}

export default Map;

