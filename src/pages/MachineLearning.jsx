import { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import GraphCard from "../components/GraphCard";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Topbar from "../components/Topbar";

function MachineLearning() {
    const navigate = useNavigate();
    
    // Default CHANNEL_ID and API_KEY (fallback)
    const DEFAULT_CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
    const DEFAULT_API_KEY = import.meta.env.VITE_API_KEY;
    
    // Device specific CHANNEL_ID and API_KEY
    const getDeviceCredentials = (device) => {
        const channelId = import.meta.env[`VITE_CHANNEL_ID_${device}`];
        const apiKey = import.meta.env[`VITE_API_KEY_${device}`];
        return {
            channelId: channelId || DEFAULT_CHANNEL_ID,
            apiKey: apiKey || DEFAULT_API_KEY
        };
    };
    
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sensorData, setSensorData] = useState({});
    const [predictedData, setPredictedData] = useState({});

    // Add new state for date filter and device selection
    const [dateRange, setDateRange] = useState('24h');
    const [device, setDevice] = useState(() => {
        // Get device from localStorage or default to '1'
        return localStorage.getItem('selectedDevice') || '1';
    });

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

    // Save device to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('selectedDevice', device);
    }, [device]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                
                // Get device-specific credentials
                const { channelId, apiKey } = getDeviceCredentials(device);
                
                // Calculate start date based on selected range
                const startDate = getStartDate(dateRange);
                const startDateStr = startDate.toISOString();
                
                // Construct API URL with date range filter
                const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&start=${startDateStr}&results=40`;
                
                const response = await axios.get(apiUrl);
                const { feeds, channel } = response.data;

                // Process the data for each sensor
                const processedData = {
                    so2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field1)
                    })),
                    pm25: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field2)
                    })),
                    pm10: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field3)
                    })),
                    co2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field4)
                    })),
                    no2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field5)
                    })),
                    o3: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field6)
                    })),
                    temperature: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field7)
                    })),
                    humidity: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field8)
                    })),
                };

                setSensorData(processedData);
            } catch (err) {
                console.error("Error fetching data from Thingspeak:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh, dateRange, device]);

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

    // Replace the getPredictions function with this real API version
    const getPredictions = async (sensorData) => {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/gabriel-uwanyirigira/dqn_model/refs/heads/main/test_forecast.json');
            const predictions = response.data; // Now an array of predictions
            console.log(predictions)
            // Process the predicted data in the same format as sensor data
            const processedPredictions = {
                so2: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field1)
                })),
                pm25: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field2)
                })),
                pm10: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field3)
                })),
                co2: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field4)
                })),
                no2: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field5)
                })),
                o3: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field6)
                })),
                temperature: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field7)
                })),
                humidity: predictions.map(pred => ({
                    time: new Date(pred.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fullDate: new Date(pred.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    value: parseFloat(pred.field8)
                }))
            };

            setPredictedData(processedPredictions);
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };

    useEffect(() => {
        if (!loading && Object.keys(sensorData).length > 0) {
            getPredictions(sensorData);
        }
    }, [sensorData, loading]);

    return (
        <div className="flex h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <Topbar 
                    loading={loading} 
                    setRefresh={setRefresh} 
                    setDateRange={setDateRange} 
                    dateRange={dateRange}
                    device={device}
                    setDevice={setDevice}
                />

                {/* Main Content */}
                <div className="ml-64 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            // Show skeleton loading when data is being fetched
                            [...Array(8)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            // Show actual graph cards when data is loaded
                            <>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard 
                                        title="SO2 Levels" 
                                        data={sensorData.so2}
                                        predictedData={predictedData.so2}
                                        showPrediction={true}
                                        sensorId="so2"
                                    />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard 
                                        title="PM2.5 Levels" 
                                        data={sensorData.pm25}
                                        predictedData={predictedData.pm25}
                                        showPrediction={true}
                                        sensorId="pm25"
                                    />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="PM10 Levels" data={sensorData.pm10} predictedData={predictedData.pm10} showPrediction={true} sensorId="pm10" />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="CO2 Levels" data={sensorData.co2} predictedData={predictedData.co2} showPrediction={true} sensorId="co2" />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="NO2 Levels" data={sensorData.no2} predictedData={predictedData.no2} showPrediction={true} sensorId="no2" />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="O3 Levels" data={sensorData.o3} predictedData={predictedData.o3} showPrediction={true} sensorId="o3" />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="Temperature" data={sensorData.temperature} predictedData={predictedData.temperature} showPrediction={true} sensorId="temperature" />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="Humidity" data={sensorData.humidity} predictedData={predictedData.humidity} showPrediction={true} sensorId="humidity" />
                                </Suspense>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MachineLearning;