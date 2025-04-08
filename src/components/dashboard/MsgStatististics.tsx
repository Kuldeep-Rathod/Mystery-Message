import React, { useCallback, useEffect, useState } from 'react';
import { WidgetItem } from './WidgetItem';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const MsgStatististics = () => {
    const [positiveResponse, setPositiveResponse] = useState<number>(0);
    const [negativeResponse, setNegativeResponse] = useState<number>(0);
    const [neutralResponse, setNeutralResponse] = useState<number>(0);
    const [totalResponse, setTotalResponse] = useState<number>(0);
    const [positivePercent, setPositivePercent] = useState<number>(0);
    const [negativePercent, setNegativePercent] = useState<number>(0);
    const [neutralPercent, setNeutralPercent] = useState<number>(0);
    const [totalPercentageChange, setTotalPercentageChange] =
        useState<number>(0);
    const [weeklyTotal, setWeeklyTotal] = useState<number>(0);

    const { data: session } = useSession();

    const handleDashboard = useCallback(async () => {
        try {
            const response = await axios.get<ApiResponse>('/api/dashboard');

            const stats = response.data.MessageStats;

            if (!stats) {
                throw new Error('Message statistics is not defined');
            }

            setPositiveResponse(stats.totalPositive ?? 0);
            setNegativeResponse(stats.totalNegative);
            setNeutralResponse(stats.totalNeutral);
            setTotalResponse(stats.total);
            setPositivePercent(stats.positivePercentage);
            setNegativePercent(stats.negativePercentage);
            setNeutralPercent(stats.neutralPercentage);
            setTotalPercentageChange(stats.totalPercentageChange);
            setWeeklyTotal(stats.weeklyTotal);

            // console.log('Statistic: ', response.data);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error', {
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch statistics',
            });
        }
    }, []);

    useEffect(() => {
        if (!session || !session.user) return;

        handleDashboard();
    }, [session, handleDashboard]);

    return (
        <>
            <section className='flex flex-row justify-center sm:justify-evenly lg:justify-between items-start gap-4 flex-wrap'>
                <WidgetItem
                    percent={positivePercent}
                    value={positiveResponse}
                    heading='Positive'
                    color='rgb(0,115,225)'
                />
                <WidgetItem
                    percent={neutralPercent}
                    value={neutralResponse}
                    heading='Neutral'
                    color='rgb(255,196,0)'
                />
                <WidgetItem
                    percent={-negativePercent}
                    value={negativeResponse}
                    heading='Negative'
                    color='#ff2323'
                />

                <WidgetItem
                    percent={totalPercentageChange}
                    value={weeklyTotal}
                    heading='Total in this week'
                    color='#ff54f6'
                />
            </section>
        </>
    );
};

export default MsgStatististics;
