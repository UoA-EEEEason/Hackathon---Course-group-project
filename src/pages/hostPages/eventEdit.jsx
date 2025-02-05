import { Avatar, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Radio, RadioGroup, Tab, Tabs, TextField, ThemeProvider, Typography } from "@mui/material";
import theme from "../../Components/theme";
import * as React from 'react';
import { useNavigate, useParams } from "react-router";
import { addHackathon, downLoadFile, getHackathon, retrieveDocFromSubCollection, retriveSubCollections } from "../../Components/firebase/firebaseFunction";
import { AppContext } from "../../Components/AppContextProvider";
import { ref } from "@firebase/storage";
import { storage } from "../../firebaseConfig";
import { styled } from '@mui/system';

const CssTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#4474F1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4474F1',
        },
    },
    '& .MuiInputLabel-outlined': {
        '&:hover': {
            color: '#4474F1',
        },
        '&.Mui-focused': {
            color: '#4474F1',
        },
    }
});

const TabPanel = ({ children, index, value }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {children}
        </div>
    );
}

function EditComponent({ hackathonid, title, description, setTitle, setDescription, status, setStatus }) {
    const [isEdit, setEdit] = React.useState(false);

    const [titleBackup, setTitleBackup] = React.useState("");
    const [descBackup, setDescBackup] = React.useState("");
    const [statusBackup, setStatusBackup] = React.useState(null);

    const handleEdit = (() => {
        setTitleBackup(title);
        setDescBackup(description);
        setStatusBackup(status);
        setEdit(!isEdit);
    })

    const handleSave = async () => {
        setEdit(!isEdit);

        const newData = {
            id: hackathonid,
            title: title,
            description: description,
            status: status
        }
        await addHackathon(newData);

    };

    const handleCancel = (() => {
        setTitle(titleBackup);
        setDescription(descBackup);
        setStatus(statusBackup);
        setEdit(!isEdit);
    })

    return (
        <div>
            {!isEdit ?
                <Button sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 'bold' }} onClick={handleEdit}>
                    Edit
                </Button>
                :
                <div>
                    <Button sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 'bold', mr: 3 }} onClick={handleSave}>
                        Save
                    </Button>
                    <Button sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 'bold' }} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            }
            {!isEdit ?
                <Typography
                    component="h4"
                    variant="h4"
                    mb={5}
                >
                    {title}
                </Typography>
                :
                <CssTextField
                    fullWidth
                    multiline
                    rows={4}
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
            }

            {!isEdit ?
                <Typography
                    component="h5"
                    mb={5}
                    mt={2}
                >
                    {description}
                </Typography>
                :
                <CssTextField
                    fullWidth
                    multiline
                    rows={16}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                />
            }
            <Box sx={{mb:5}}></Box>
            {!isEdit ?
                <Typography
                    component="h5"
                    mb={5}
                    mt={2}
                >
                    Status: {status}
                </Typography>
                :
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={status}
                        onChange={(e)=>{setStatus(event.target.value)}}
                    >
                        <FormControlLabel value="ongoing" control={<Radio />} label="Ongoing" />
                        <FormControlLabel value="ended" control={<Radio />} label="Ended" />
                    </RadioGroup>
                </FormControl>
            }
        </div>
    )
}

function SubmissionList({ hackathonid }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [submissions, setSubmissions] = React.useState([]);

    const handleChooseWinner = async () => {
        if (submissions.length <= 0) {
            return;
        }
        const user = submissions[selectedIndex];
        const newData = {
            id: hackathonid,
            winner: user
        }
        await addHackathon(newData);
    }

    React.useEffect(() => {
        const sub = retriveSubCollections(hackathonid, 'Submissions');
        sub.then(function (result) {
            const data = result.map((doc) => {
                return doc.data().user;
            });
            setSubmissions([...data]);
        });
    }, [hackathonid]);

    function ParticipantAnswer({ userID }) {
        const [questions, setQuestions] = React.useState([]);
        const [answers, setAnswers] = React.useState([]);

        React.useEffect(() => {
            const user = retrieveDocFromSubCollection(hackathonid, 'Submissions', userID);
            user.then(function (result) {
                setQuestions(result.questions);
                setAnswers(result.answers);
            });
        }, [hackathonid]);

        return (
            <div>
                {questions.map((q, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography>
                            {q}
                        </Typography>
                        <Typography>
                            {answers[index]}
                        </Typography>
                    </Box>
                ))}
            </div>
        )
    }

    return (
        <div>
            <List component="nav" aria-label="secondary mailbox folder">
                {submissions.map((sub, index) => (
                    <div key={index}>
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <ListItemText primary={sub} />
                            <ListItemSecondaryAction>
                                <Button
                                    onClick={() => {
                                        const fileRef = ref(storage, 'hackathons/' + hackathonid + '/submissions/' + sub);
                                        downLoadFile(fileRef);
                                    }}
                                >Download File</Button>
                            </ListItemSecondaryAction>
                        </ListItemButton>

                        {selectedIndex === index && <ParticipantAnswer userID={sub} />}
                    </div>
                ))}
            </List>

            <Button
                onClick={handleChooseWinner}
            >
                Choose winner
            </Button>
        </div>
    )
}


function EditForm({ hackathonid }) {
    const [regQuestions, setRegQuestions] = React.useState([]);
    const [regRequirements, setRegRequirements] = React.useState('');

    const [subQuestions, setSubQuestions] = React.useState([]);
    const [subRequirements, setSubRequirements] = React.useState('');

    const navigate = useNavigate();

    const handleRegQuestion = () => {
        setRegQuestions([...regQuestions, ""]);
    }

    const handleSubQuestion = () => {
        setSubQuestions([...subQuestions, ""]);
    }

    const handleSave = async () => {
        const newData = {
            id: hackathonid,
            regQuestions: regQuestions,
            regRequirements: regRequirements,
            subQuestions: subQuestions,
            subRequirements: subRequirements
        }
        await addHackathon(newData);
        navigate(0);

    };

    React.useEffect(() => {
        const sub = getHackathon(hackathonid);
        sub.then(function (result) {
            setRegRequirements(result.regRequirements);
            setRegQuestions(result.regQuestions);
            setSubRequirements(result.subRequirements);
            setSubQuestions(result.subQuestions);
        });
    }, [hackathonid]);

    function SubmissionQuestion({ index, subQuestion }) {
        const [question, setQuestion] = React.useState(subQuestion);

        const handleChange = (e) => {
            setQuestion(e.target.value);

            subQuestions[index] = e.target.value;
        }

        return (
            <div>
                <TextField
                    value={question}
                    onChange={handleChange}
                />
                <Button onClick={() => {
                    subQuestions.splice(index, 1);
                    setSubQuestions([...subQuestions]);
                }}>
                    X
                </Button>
            </div>
        )
    }


    function RegistrationQuestion({ index, regQuestion }) {
        const [question, setQuestion] = React.useState(regQuestion);

        const handleChange = (e) => {
            setQuestion(e.target.value);

            regQuestions[index] = e.target.value;
        }

        return (
            <div>
                <TextField
                    value={question}
                    onChange={handleChange}
                />
                <Button onClick={() => {
                    regQuestions.splice(index, 1);
                    setRegQuestions([...regQuestions]);
                }}>
                    X
                </Button>
            </div>
        )
    }

    return (
        <Box>
            <Typography sx={{ my:2 }}>
                Registration questions
            </Typography>
            {regQuestions.map((regQuestion, index) => (
                <RegistrationQuestion sx={{ color: '#4474F1' }} key={index} index={index} regQuestion={regQuestion} />
            ))}
            <Button sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 600, mr: 3 }} onClick={handleRegQuestion}>
                Add question
            </Button>
            <CssTextField
                id="reg-requirements"
                label="Registration Requirements"
                multiline
                rows={4}
                sx={{ paddingTop: '10px', paddingBottom: '10px' }}
                value={regRequirements}
                onChange={(e) => { setRegRequirements(e.target.value) }}
                fullWidth
                placeholder="Mention any requirements for registration, as well as any required files (one upload)"
            />

            <Typography sx={{ mt:2 }}>
                Submission questions
            </Typography>
            {subQuestions.map((subQuestion, index) => (
                <SubmissionQuestion key={index} index={index} subQuestion={subQuestion} />
            ))}
            <Button sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 600, mr: 3 }} onClick={handleSubQuestion}>
                Add question
            </Button>
            <CssTextField
                id="reg-requirements"
                label="Submission Requirements"
                multiline
                rows={4}
                sx={{ paddingTop: '10px', paddingBottom: '10px' }}
                value={subRequirements}
                onChange={(e) => { setSubRequirements(e.target.value) }}
                fullWidth
                placeholder="Mention any requirements for submission, as well as any required files (one upload)"
            />

            <Button
                onClick={() => { navigate(0) }}
                sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 'bold', mr: 3 }}
            >
                Cancel
            </Button>
            <Button
                onClick={handleSave}
                sx={{ color: 'white', my: 3, bgcolor: '#4474F1', fontWeight: 'bold', mr: 3 }}
            >
                Save
            </Button>
        </Box>
    )
}

function RegistrationList({ hackathonid }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [registrations, setRegistrations] = React.useState([]);

    function ParticipantAnswer({ userID }) {
        const [questions, setQuestions] = React.useState([]);
        const [answers, setAnswers] = React.useState([]);

        React.useEffect(() => {
            const user = retrieveDocFromSubCollection(hackathonid, 'Registrations', userID);
            user.then(function (result) {
                setQuestions(result.questions);
                setAnswers(result.answers);
            });
        }, [hackathonid]);

        return (
            <div>
                {questions.map((q, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography>
                            {q}
                        </Typography>
                        <Typography>
                            {answers[index]}
                        </Typography>
                    </Box>
                ))}
            </div>
        )
    }

    React.useEffect(() => {
        const reg = retriveSubCollections(hackathonid, 'Registrations');

        reg.then(function (result) {
            const data = result.map((doc) => {
                return doc.data().user;
            });
            setRegistrations([...data]);
        });
    }, [hackathonid]);


    return (
        <div>
            <List component="nav" aria-label="secondary mailbox folder">
                {registrations.map((reg, index) => (
                    <div>
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={() => setSelectedIndex(index)}
                            key={index}
                        >
                            <ListItemText primary={reg} />
                            <ListItemSecondaryAction>
                                <Button
                                    onClick={() => {
                                        const fileRef = ref(storage, 'hackathons/' + hackathonid + '/registrations/' + reg);
                                        downLoadFile(fileRef);
                                    }}
                                >Download File</Button>
                            </ListItemSecondaryAction>
                        </ListItemButton>

                        {selectedIndex === index && <ParticipantAnswer userID={reg} />}
                    </div>
                ))}
            </List>
        </div>
    )
}

export default function EventEdit() {
    const [value, setValue] = React.useState(0);

    const { id } = useParams();

    const handleChange = ((e, newValue) => {
        setValue(newValue);
    });

    const hackathon = getHackathon(id);
    const [title, setTitle] = React.useState("test");
    const [description, setDescription] = React.useState("test");
    const [validHackathon, setValidHackathon] = React.useState(false);
    const [hStatus, setStatus] = React.useState('ongoing');

    React.useEffect(() => {
        hackathon.then(function (result) {
            setTitle(result.title);
            setDescription(result.description);
            setStatus(result.status);

            setValidHackathon(true);
        });
    }, [id]);


    return validHackathon ? (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ '& .MuiTabs-indicator': { backgroundColor: '#4474F1' } }}>
                        <Tab sx={{ '&.Mui-selected': { color: '#4474F1', fontSize: 15, fontWeight: 'bold' }, color: '#C9C9C9', fontSize: 15, fontWeight: 'bold' }} label="Event page" />
                        <Tab sx={{ '&.Mui-selected': { color: '#4474F1', fontSize: 15, fontWeight: 'bold' }, color: '#C9C9C9', fontSize: 15, fontWeight: 'bold' }} label="Registrations" />
                        <Tab sx={{ '&.Mui-selected': { color: '#4474F1', fontSize: 15, fontWeight: 'bold' }, color: '#C9C9C9', fontSize: 15, fontWeight: 'bold' }} label="Submissions" />
                        <Tab sx={{ '&.Mui-selected': { color: '#4474F1', fontSize: 15, fontWeight: 'bold' }, color: '#C9C9C9', fontSize: 15, fontWeight: 'bold' }} label="Edit forms" />
                    </Tabs>
                </Box>
                <TabPanel
                    value={value}
                    index={0}
                >
                    <EditComponent
                        hackathonid={id}
                        title={title}
                        description={description}
                        status={hStatus}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setStatus={setStatus}
                    />
                </TabPanel>
                <TabPanel
                    value={value}
                    index={1}
                >
                    <RegistrationList
                        hackathonid={id}
                    />
                </TabPanel>
                <TabPanel
                    value={value}
                    index={2}
                >
                    <SubmissionList
                        hackathonid={id}
                    />
                </TabPanel>
                <TabPanel
                    value={value}
                    index={3}
                >
                    <EditForm
                        hackathonid={id}
                    />
                </TabPanel>
            </Box>
        </ThemeProvider>
    ) : (<></>)
}