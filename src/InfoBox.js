import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({title, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick} className='infoBox'>
            <CardContent>
                {/* Title = covid cases */}
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>

                {/* +120 Number of cases */}
                <h2 className='infoBox__cases'>{cases}</h2>

                {/* Total */}
                <Typography className='infoBox__total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
