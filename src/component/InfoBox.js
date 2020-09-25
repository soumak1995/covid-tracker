import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import '../css/InfoBox.css'
function InfoBox({title,cases,active,total,isRed,...props}) {
    return (
        <Card  onClick={props.onClick} className={`infobox ${active && "infobox--selected"} ${isRed && 'infobox--red'}`}>
            <CardContent>
                <Typography className="infobox__title"color="textSecondary">
                   {title}
                </Typography>
                <div className={`infobox__cases ${!isRed && "infoBox__cases--green"}` }>
                <h2 >{cases}</h2>
                </div>
               
                <Typography className="infobox__total"color="textSecondary">
                   {total}Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
