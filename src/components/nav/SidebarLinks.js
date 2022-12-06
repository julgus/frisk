import React from 'react'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { object } from 'prop-types';
import { ConstructionOutlined } from '@material-ui/icons';

export function getPageName(link, name) {
    var title = "Welcome back, " + name + "!";
    SidebarLinks.forEach(o => {
        if (o.link.includes(link)) {
            title = o.title; 
        }
    }); 
    return title;
}

export const SidebarLinks = [
    {
        title: "Dashboard",
        icon: <MailOutlineIcon />,
        link: "/portal/"
    }, 
    {
        title: "Medication",
        icon: <MedicationIcon />,
        link: "/portal/medication"
    }, 
    {
        title: "Conditions",
        icon: <FavoriteBorderIcon />,
        link: "/portal/conditions"
    }, 
    {
        title: "Lab Results",
        icon: <MonitorHeartIcon />,
        link: "/portal/labresults"
    }, 
    {
        title: "Vaccination",
        icon: <VaccinesIcon />,
        link: "/portal/vaccination"
    }
]