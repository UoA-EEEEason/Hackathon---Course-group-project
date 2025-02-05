import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../Components/theme';
import HackathonList from '../../Components/HackathonList'
import { EmojiPeople } from '@mui/icons-material';
import { getUserProfile } from '../../Components/firebase/firebaseFunction';
import { AppContext } from '../../Components/AppContextProvider';
import { useState, useEffect, useContext } from 'react';

const initialFilters = { tag: null, offset: null, status: null, username: null, role: null}
// This is the main function that returns the participantHome component
export default function ParticipantHome() {

    const { currentUser } = useContext(AppContext);

    const [filters, setFilters] = useState(initialFilters);
    const [username, setUsername] = React.useState("");

    React.useEffect(() => {
        if (currentUser !== null) {
            const user = getUserProfile(currentUser.email);
            user.then(function (result) {
                setUsername(result.username);
            });
        }
    }, [currentUser]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Box component to wrap the heading and subheading with a background color */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: -2,
                    pl: 0,
                }}
            >
                <Container maxWidth="md">

                    {/* Typography component to display the greeting message with the user's name */}
                    <Typography
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'Inter',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            fontSize: '24px',
                            mb: 2,
                        }}
                    >
                         {`Hey, ${username}`}
                        {/* EmojiPeople icon to visually enhance the greeting message */}
                        <EmojiPeople fontSize="large" sx={{ ml: 1 }} />
                    </Typography>
                    {/* Typography component to display a subheading with a call to action */}
                    <Typography
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'Inter',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '18px',
                            mb: 2,
                        }}
                    >
                        Start participating in these hackathons.
                    </Typography>
                </Container>
            </Box>

            {/* Display the hackathon cards */}
            <HackathonList filters={filters} pagename={'participantHome'} isParticipant={true}/>

        </ThemeProvider>
    );

}