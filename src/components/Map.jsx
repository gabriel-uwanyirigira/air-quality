import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import { Icon, map } from 'leaflet'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { set } from 'react-hook-form';

const Map = () => {
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState([]);
    const [mapZoom, setMapZoom] = useState(15);
    const [centerPosition, setCenterPosition] = useState([]);
    const [circleRadius, setCircleRadius] = useState(0);
    useEffect(() => {
        (async ()=>{
            setLoading(true);
            const response = await axios.get("/map.json")
            const {coordinates, zoom, centralPoint, circleRadius} = response.data;
            
            setPosition(coordinates);
            setMapZoom(zoom);
            setCenterPosition(centralPoint);
            setCircleRadius(circleRadius);
            toast.success("Map loaded successfully");

            setLoading(false);
        })()
    }, [])

    
    // const centerPosition = [-1.9810424478569857, 30.176807147834634]
    
    // const position = [
    //     [-1.9810424478569857, 30.176807147834634],
    //     [-2.607845, 29.73475]
    // ];

    return (
        <>
            <Toaster />
            {!loading ?
                <div className='w-full h-full overflow-hidden rounded' style={{ zIndex: '1' }}>
                    <MapContainer center={centerPosition} zoom={mapZoom} scrollWheelZoom={true}>
                        <TileLayer attribution='Sensors Map' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {position.map((pos, index) => (
                            <span key={index}>
                                <Marker position={pos}> <Popup> Sensor #{index}. </Popup> </Marker>
                                <Circle center={pos} radius={circleRadius} pathOptions={{ color: '#077bff' }} />
                            </span>
                        ))}
                    </MapContainer>
                </div>

                :

                <p>Loading map</p>

            }

        </>
    )
}

export default Map
