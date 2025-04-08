import { TrendingDown, TrendingUp } from 'lucide-react';

// Widget Items
export interface WidgetItemProps {
    heading: string;
    value: number;
    percent: number;
    color: string;
}

export const WidgetItem = ({
    heading,
    value,
    percent,
    color,
}: WidgetItemProps) => {
    const gradientDegrees = (Math.abs(percent) / 100) * 360;

    return (
        <article className='min-w-64 bg-gray-700/50 shadow-[0_0_10px_rgba(0,0,0,0.132)] p-8 rounded-xl flex justify-between items-stretch gap-0'>
            <div className='flex flex-col'>
                <p className='text-sm text-white'>{heading}</p>
                <h4 className='text-2xl font-semibold mt-1'>
                    {value.toLocaleString()}
                </h4>
                <span
                    className={`flex items-center gap-1 mt-1 text-sm ${
                        percent > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {percent > 0 ? (
                        <TrendingUp className='w-4 h-4' />
                    ) : (
                        <TrendingDown className='w-4 h-4' />
                    )}
                    {percent > 0 ? '+' : ''}
                    {percent}%
                </span>
            </div>

            <div
                className='relative w-20 h-20 rounded-full flex-none grid place-items-center'
                style={{
                    background: `conic-gradient(
                        ${color} ${gradientDegrees}deg, 
                        rgb(255,255,255) 0
                    )`,
                }}
            >
                <div className='absolute w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center'>
                    <span
                        className='font-medium'
                        style={{ color }}
                    >
                        {percent}%
                    </span>
                </div>
            </div>
        </article>
    );
};
