import React from 'react';
import { Card, CardContent, Grid, Typography, Box, Chip } from '@mui/material';
import {
    IconUsers,
    IconChecklist,
    IconClipboardCheck,
    IconStar,
    IconTrendingUp,
    IconBriefcase,
    IconTarget,
} from '@tabler/icons-react';

const TeamStatsCard = ({ stats }) => {
    if (!stats) return null;

    const statItems = [
        {
            title: 'Total Members',
            value: stats.totalMembers || 0,
            icon: IconUsers,
            color: 'primary',
        },
        {
            title: 'Bookings Completed',
            value: stats.totalBookingsCompleted || 0,
            icon: IconClipboardCheck,
            color: 'success',
        },
        {
            title: 'Bookings Assigned',
            value: stats.totalBookingsAssigned || 0,
            icon: IconChecklist,
            color: 'info',
        },
        {
            title: 'Average Rating',
            value: stats.averageRating ? parseFloat(stats.averageRating).toFixed(1) : '0.0',
            icon: IconStar,
            color: 'warning',
            suffix: '/ 5.0',
        },
        {
            title: 'Completion Rate',
            value: stats.completionRate || '0.00',
            icon: IconTrendingUp,
            color: 'success',
            suffix: '%',
        },
        {
            title: 'Total Experience',
            value: stats.totalExperience || 0,
            icon: IconBriefcase,
            color: 'secondary',
            suffix: ' years',
        },
        {
            title: 'Projects Done',
            value: stats.totalProjectsDone || 0,
            icon: IconTarget,
            color: 'error',
        },
    ];

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Team Performance Overview
                </Typography>
                <Grid container spacing={2}>
                    {statItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 1,
                                        bgcolor: `${item.color}.lighter`,
                                        border: 1,
                                        borderColor: `${item.color}.light`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                            bgcolor: `${item.color}.main`,
                                            color: 'white',
                                        }}
                                    >
                                        <Icon size={24} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {item.value}
                                            {item.suffix && (
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ ml: 0.5 }}
                                                >
                                                    {item.suffix}
                                                </Typography>
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TeamStatsCard;
