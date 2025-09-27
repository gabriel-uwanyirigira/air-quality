import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Sensors() {
    const navigate = useNavigate();
    
    const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sensorData, setSensorData] = useState([]);
    const [dateRange, setDateRange] = useState('24h');

    // Function to calculate start date based on selected range
    const getStartDate = (range) => {
        const now = new Date();
        switch (range) {
            case '24h':
                return new Date(now.getTime() - 24 * 60 * 60 * 1000);
            case '7d':
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case '30d':
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to 24h
        }
    };

    // Sensor field mapping
    const sensorFields = {
        'so2': { name: 'SO2', field: 'field1', unit: 'ppm', description: 'Sulfur Dioxide', color: 'bg-red-500' },
        'pm25': { name: 'PM2.5', field: 'field2', unit: 'µg/m³', description: 'Fine Particulate Matter', color: 'bg-orange-500' },
        'pm10': { name: 'PM10', field: 'field3', unit: 'µg/m³', description: 'Coarse Particulate Matter', color: 'bg-yellow-500' },
        'co2': { name: 'CO2', field: 'field4', unit: 'ppm', description: 'Carbon Dioxide', color: 'bg-gray-500' },
        'no2': { name: 'NO2', field: 'field5', unit: 'ppm', description: 'Nitrogen Dioxide', color: 'bg-blue-500' },
        'o3': { name: 'O3', field: 'field6', unit: 'ppm', description: 'Ozone', color: 'bg-purple-500' },
        'temperature': { name: 'Temperature', field: 'field7', unit: '°C', description: 'Ambient Temperature', color: 'bg-green-500' },
        'humidity': { name: 'Humidity', field: 'field8', unit: '%', description: 'Relative Humidity', color: 'bg-teal-500' }
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                
                // Calculate start date based on selected range
                const startDate = getStartDate(dateRange);
                const startDateStr = startDate.toISOString();
                
                // Construct API URL with date range filter
                const apiUrl = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&start=${startDateStr}&results=1`;
                
                const response = await axios.get(apiUrl);
                const { feeds } = response.data;

                if (feeds && feeds.length > 0) {
                    const latestFeed = feeds[0];
                    const processedData = Object.keys(sensorFields).map(key => {
                        const sensor = sensorFields[key];
                        return {
                            id: key,
                            name: sensor.name,
                            value: parseFloat(latestFeed[sensor.field]),
                            unit: sensor.unit,
                            description: sensor.description,
                            color: sensor.color
                        };
                    });
                    setSensorData(processedData);
                }
            } catch (err) {
                console.error("Error fetching data from Thingspeak:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh, dateRange]);

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    // Loading skeleton component
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
        </div>
    );

    return (
        <div className="flex h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <Topbar loading={loading} setRefresh={setRefresh} setDateRange={setDateRange} dateRange={dateRange} />

                {/* Main Content */}
                <div className="lg:ml-64 p-4 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Sensor Overview</h1>
                        <p className="text-gray-600 mt-1">View detailed information for each sensor</p>
                    </div>

                    {/* Sensor Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [...Array(8)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : sensorData.length > 0 ? (
                            sensorData.map((sensor) => (
                                <div 
                                    key={sensor.id}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => navigate(`/sensors/${sensor.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">{sensor.name}</h3>
                                        <div className={`w-4 h-4 rounded-full ${sensor.color}`}></div>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{sensor.description}</p>
                                    <div className="mt-4">
                                        <p className="text-3xl font-bold text-gray-900">
                                            {sensor.value !== null && !isNaN(sensor.value) ? sensor.value : 'N/A'}
                                            <span className="text-lg font-normal text-gray-500 ml-1">{sensor.unit}</span>
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white rounded-xl shadow-md p-6 text-center">
                                <p className="text-gray-500">No sensor data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sensors;