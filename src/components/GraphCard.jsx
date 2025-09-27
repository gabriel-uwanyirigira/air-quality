import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function GraphCard({ title, data, predictedData, showPrediction, sensorId }) {
    const navigate = useNavigate();
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-2 rounded shadow-lg">
                    <p className="text-sm text-gray-600">{`Date: ${payload[0].payload.fullDate}`}</p>
                    <p className="text-sm font-semibold text-red-600">
                        {`Actual: ${payload[0].value}`}
                    </p>
                    {showPrediction && payload[1] && (
                        <p className="text-sm font-semibold text-blue-600">
                            {`Predicted: ${payload[1].value}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Map title to sensor ID
    const getTitleToIdMap = () => {
        const titleMap = {
            "SO2 Levels": "so2",
            "PM2.5 Levels": "pm25",
            "PM10 Levels": "pm10",
            "CO2 Levels": "co2",
            "NO2 Levels": "no2",
            "O3 Levels": "o3",
            "Temperature": "temperature",
            "Humidity": "humidity"
        };
        return titleMap;
    };

    const handleClick = () => {
        if (sensorId) {
            navigate(`/sensors/${sensorId}`);
        } else {
            const titleMap = getTitleToIdMap();
            const id = titleMap[title];
            if (id) {
                navigate(`/sensors/${id}`);
            }
        }
    };

    return (
        <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleClick}
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data}
                        margin={{ top: 5, right: 5, bottom: 20, left: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        {/* Actual Data Line */}
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#ff0000" 
                            dot={{ fill: '#ff0000' }}
                            strokeWidth={2}
                            name="Actual"
                        />

                        {/* Predicted Data Line */}
                        {showPrediction && predictedData && (
                            <Line 
                                type="monotone" 
                                data={predictedData}
                                dataKey="value" 
                                stroke="#2563eb" 
                                dot={{ fill: '#2563eb' }}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="Predicted"
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View Details →
                </button>
            </div>
        </div>
    );
}