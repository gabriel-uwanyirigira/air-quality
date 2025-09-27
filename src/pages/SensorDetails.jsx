import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import GraphCard from "../components/GraphCard";

function SensorDetails() {
    const { sensorId } = useParams();
    const navigate = useNavigate();
    
    const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sensorData, setSensorData] = useState(null);
    const [sensorInfo, setSensorInfo] = useState(null);
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
        'so2': { name: 'SO2', field: 'field1', unit: 'ppm', description: 'Sulfur Dioxide' },
        'pm25': { name: 'PM2.5', field: 'field2', unit: 'µg/m³', description: 'Fine Particulate Matter' },
        'pm10': { name: 'PM10', field: 'field3', unit: 'µg/m³', description: 'Coarse Particulate Matter' },
        'co2': { name: 'CO2', field: 'field4', unit: 'ppm', description: 'Carbon Dioxide' },
        'no2': { name: 'NO2', field: 'field5', unit: 'ppm', description: 'Nitrogen Dioxide' },
        'o3': { name: 'O3', field: 'field6', unit: 'ppm', description: 'Ozone' },
        'temperature': { name: 'Temperature', field: 'field7', unit: '°C', description: 'Ambient Temperature' },
        'humidity': { name: 'Humidity', field: 'field8', unit: '%', description: 'Relative Humidity' }
    };

    useEffect(() => {
        if (!sensorId || !sensorFields[sensorId]) {
            navigate('/');
            return;
        }

        setSensorInfo(sensorFields[sensorId]);
        
        (async () => {
            try {
                setLoading(true);
                
                // Calculate start date based on selected range
                const startDate = getStartDate(dateRange);
                const startDateStr = startDate.toISOString();
                
                // Construct API URL with date range filter
                const apiUrl = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&start=${startDateStr}`;
                
                const response = await axios.get(apiUrl);
                const { feeds } = response.data;

                // Process data for the specific sensor
                const processedData = feeds.map(feed => ({
                    time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(feed[sensorFields[sensorId].field])
                }));

                setSensorData(processedData);
            } catch (err) {
                console.error("Error fetching data from Thingspeak:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [sensorId, refresh, dateRange]);

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    // Loading skeleton component
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );

    if (!sensorId || !sensorFields[sensorId]) {
        return null;
    }

    return (
        <div className="flex h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <Topbar loading={loading} setRefresh={setRefresh} setDateRange={setDateRange} dateRange={dateRange} />

                {/* Main Content */}
                <div className="lg:ml-64 p-4 lg:p-8">
                    <div className="mb-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 mt-4">
                            {sensorInfo?.name} Sensor Details
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {sensorInfo?.description} ({sensorInfo?.unit})
                        </p>
                    </div>

                    {/* Sensor Stats */}
                    {!loading && sensorData && sensorData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">
                                    {sensorData[sensorData.length - 1]?.value} {sensorInfo?.unit}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-sm font-medium text-gray-500">Average</h3>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">
                                    {(sensorData.reduce((sum, item) => sum + item.value, 0) / sensorData.length).toFixed(2)} {sensorInfo?.unit}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-sm font-medium text-gray-500">Max Value</h3>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">
                                    {Math.max(...sensorData.map(item => item.value)).toFixed(2)} {sensorInfo?.unit}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h3 className="text-sm font-medium text-gray-500">Min Value</h3>
                                <p className="text-2xl font-bold text-indigo-600 mt-1">
                                    {Math.min(...sensorData.map(item => item.value)).toFixed(2)} {sensorInfo?.unit}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sensor Graph */}
                    <div className="grid grid-cols-1 gap-6">
                        {loading ? (
                            <SkeletonCard />
                        ) : sensorData ? (
                            <GraphCard 
                                title={`${sensorInfo?.name} Levels Over Time`} 
                                data={sensorData} 
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                                <p className="text-gray-500">No data available for this sensor</p>
                            </div>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">About {sensorInfo?.name}</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-600">
                                {sensorInfo?.name} ({sensorInfo?.description}) is an important air quality indicator. 
                                Monitoring this parameter helps assess air quality and potential health impacts.
                            </p>
                            <p className="text-gray-600 mt-2">
                                Values are measured in {sensorInfo?.unit} and updated regularly from our sensor network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SensorDetails;