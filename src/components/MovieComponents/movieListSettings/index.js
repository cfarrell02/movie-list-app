// MovieAdd.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, List, ListItem, CircularProgress, ListItemText, useMediaQuery, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Divider } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { findUserByEmail, normaliseEmail } from "../../../api/userDirectory";
import { memberFields, membersWithRoles, roleOf, updateMovieList } from "../../../api/movieStorage";
import { getUserRoles } from "../../../utils";
import { auth } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import ListTransfer from "../listTransfer";
import { AlertContext } from "../../../contexts/alertContext";
import ConfimationModal from "../../Modals/confirmationModal";

const MovieListSettings = ({ movieList, setMovieList, onListChanged }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [movieListTitle, setMovieListTitle] = useState(movieList.title);
  const [accessType, setAccessType] = useState(0);
  const { addAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [creationDate, setCreationDate] = useState('' );
  const [warningModalDetails, setWarningModalDetails] = useState({show: false});

  // Depend on the member fields themselves: the parent passes a fresh movieList object on every render
  useEffect(() => {
    setUsers(membersWithRoles(movieList));
  }, [movieList.users, movieList.userIds, movieList.ownerIds, movieList.adminIds, movieList.editorIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const created = movieList.createdOn;
    if (!created) return;
    const date = created.seconds ? new Date(created.seconds * 1000) : new Date(created);
    if (!isNaN(date.getTime())) setCreationDate(date.toDateString());
  }, [movieList.createdOn]);

  useEffect(() => {
    if (user?.uid) setAccessType(Math.max(roleOf(movieList, user.uid), 0));
  }, [user, movieList.users, movieList.userIds, movieList.ownerIds, movieList.adminIds, movieList.editorIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateListTitle = async (title) => {
    try {
      if (!title) {
        throw new Error("Invalid title.");
      }
      const updatedMovieList = { ...movieList, title };
      // Only write the changed field: movieList holds the movies/shows as they were when the page loaded
      await updateMovieList(movieList.id, { title });
      setMovieList(updatedMovieList);
      addAlert("success", "Watch List title updated.");
    } catch (error) {
      console.error("Error updating watch list title:", error);
      addAlert("error", "Error updating watch list title.");
    }
  };

  // Members are added by exact email: the directory deliberately can't be browsed or searched
  const handleAddUserToMovieList = async () => {
    try {
      const email = normaliseEmail(memberEmail);
      if (!email || !email.includes("@")) throw new Error("Enter the person's email address.");
      setIsAddingMember(true);
      const found = await findUserByEmail(email);
      if (!found) throw new Error(`No Watchlist account uses ${email}. Check the address, or ask them to sign in once.`);
      if (movieList.userIds.includes(found.uid)) throw new Error(`${email} is already on this list.`);

      const updatedUsers = [...users, { uid: found.uid, accessType: 0, email }];
      const updatedMovieList = { ...movieList, ...memberFields(updatedUsers) };
      await updateMovieList(movieList.id, memberFields(updatedUsers));
      setUsers(updatedUsers);
      setMovieList(updatedMovieList);
      setMemberEmail("");
      addAlert("success", `${found.firstName ? `${found.firstName} (${email})` : email} added as a Viewer.`);
    } catch (error) {
      addAlert("error", error.message);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleUpdateUserAccessType = async (userID, accessType) => {
    try {
      if (accessType < 0 || accessType > 3) {
        throw new Error("Invalid access type.");
      }
      const user = users.find((u) => u.uid === userID);

      if (accessType === 3){
        setWarningModalDetails({show: true, title: 'Change Ownership', body: `Are you sure you want to change the ownership of this watch list to ${user.email}? You will be demoted to an admin.`,
        userId: userID});
        return;
      }


      const updatedUsers = users.map((member) => (member.uid === userID ? { ...member, accessType } : member));
      setUsers(updatedUsers);
      const updatedMovieList = { ...movieList, ...memberFields(updatedUsers) };
      setMovieList(updatedMovieList);

      await updateMovieList(movieList.id, memberFields(updatedMovieList.users));
      addAlert(
        "success",
        `${user.email} is now ${getUserRoles(accessType) === 'Admin' ? 'an' : 'a'} ${getUserRoles(accessType)}.`
      );
    } catch (error) {
      addAlert("error", error.message);
    }
  };

  const changeOwnership = async (userID) => {
    try {
      const user = users.find((u) => u.uid === userID);
      // New owner takes over; the previous owner becomes an admin
      const updatedUsers = users.map((member) => {
        if (member.uid === userID) return { ...member, accessType: 3 };
        if (member.accessType === 3) return { ...member, accessType: 2 };
        return member;
      });
      setUsers(updatedUsers);
      const updatedMovieList = { ...movieList, ...memberFields(updatedUsers) };
      setMovieList(updatedMovieList);
      setWarningModalDetails({show: false, title: '', body
        : ''});

      await updateMovieList(movieList.id, memberFields(updatedMovieList.users));
      addAlert(
        "success",
        `User ${user.email} is now the owner of the watch list. You have been demoted to an admin.`
      );
    } catch (error) {
      addAlert("error", error.message);
    }
  };

  const handleRemoveUserFromMovieList = async (userID) => {
    try {
      const removed = users.find((u) => u.uid === userID);
      const updatedUsers = users.filter((member) => member.uid !== userID);
      const updatedMovieList = { ...movieList, ...memberFields(updatedUsers) };
      setUsers(updatedUsers);
      await updateMovieList(movieList.id, memberFields(updatedMovieList.users));
      setMovieList(updatedMovieList);
      addAlert("info", user.uid === userID ? "You left the watch list." : `${removed?.email || "User"} removed from watch list.`);
      if (user.uid === userID) {
        navigate("/movielist");
      }
      // Update the logic for navigating to '/movielist' based on your requirements
    } catch (error) {
      addAlert("error", error.message);
    }
  };


  const shouldShowPromote = (user) => {
    if (accessType === 3) return user.accessType !== 3; // Owner can promote anyone except other owners, and not beyond 3
    if (accessType === 2) return user.accessType === 0 || user.accessType === 1; // Admin can promote users and viewers to admin
    return false; // Users and viewers can't promote anyone
  };
  
  const shouldShowDemote = (user) => {
    if (accessType === 3) return user.accessType !== 3 && user.accessType > 0; // Owner can demote anyone except themselves, and not below 0
    if (accessType === 2) return user.accessType === 1; // Admin can demote users and viewers, but not themselves or other admins
    return false; // Users and viewers can't demote anyone
  };
  
  const shouldShowDelete = (user1) => {
    const isSelf = user1.uid === user.uid;
    if (accessType === 3) return user1.accessType !== 3; // Owner can delete anyone except themselves
    if (accessType === 2){ 
      return user1.accessType === 0 || user1.accessType === 1 || isSelf; // Admin can delete users, viewers, and themselves only
      }
    return isSelf; // Users and viewers can only delete themselves
  };
  

  return (
    <Box>
      <ConfimationModal
        open={warningModalDetails.show}
        onClose={() => setWarningModalDetails({show: false})}
        onConfirm={() => changeOwnership(warningModalDetails.userId)}
        header={warningModalDetails.title}
        body={warningModalDetails.body}
      />



      <Typography variant="h5" component="h2">
        List settings
      </Typography>
      {creationDate && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Created on {creationDate}.
      </Typography>
      )}
      <Accordion disableGutters variant="outlined" sx={{ "&:not(:last-of-type)": { borderBottom: 0 }, "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h6" component="h3">
            Export / import
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ListTransfer
            movieList={movieList}
            accessType={accessType}
            currentUserID={user?.uid}
            onImported={onListChanged}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters variant="outlined" sx={{ "&:not(:last-of-type)": { borderBottom: 0 }, "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h6" component="h3">
            Watch List Name
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                id="outlined-basic"
                label="New Watch List Title"
                value={movieListTitle}
                disabled={accessType === 0}
                variant="outlined"
                onChange={(event) => setMovieListTitle(event.target.value)}
                onSubmit={() => handleUpdateListTitle(movieListTitle)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} >
              <Button
                variant="contained"
                color="primary"
                disabled={accessType === 0}
                onClick={() => handleUpdateListTitle(movieListTitle)}
                fullWidth
              >
                Update Title
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters variant="outlined" sx={{ "&:not(:last-of-type)": { borderBottom: 0 }, "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h6" component="h3">
            Manage Access
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" component="h3">
            Users with Access
          </Typography>
          <Grid container sx={{ display: "flex", flexDirection: "column" }}>
            <Grid
              item
              xs={12}
              sx={{
                margin: ".5em",
                borderRadius: "5px",
                border: 1, borderColor: "divider",
              }}
            >
              {isMobile ? ( //Mobile view
                <List>
                  {!users ? (
                    <CircularProgress />
                  ) : (
                    users.map((user1, index) => (
                      <>
                        <ListItem
                          key={user1.uid}
                          sx={{
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                          }}
                        >
                          <ListItemText
                            primary={user1.email}
                            sx={{ width: "100%" }}
                          />
                          <ListItemText
                            primary={getUserRoles(user1.accessType)}
                            sx={{ width: "100%" }}
                          />
                          
                            <Container
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                edge="end"
                                aria-label="upgrade"
                                disabled={!shouldShowPromote(user1)}
                                onClick={() =>
                                  handleUpdateUserAccessType(
                                    user1.uid,
                                    parseInt(user1.accessType) + 1
                                  )
                                }
                              >
                                <ArrowDropUpIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="downgrade"
                                disabled={!shouldShowDemote(user1)}
                                onClick={() =>
                                  handleUpdateUserAccessType(
                                    user1.uid,
                                    parseInt(user1.accessType) - 1
                                  )
                                }
                              >
                                <ArrowDropDownIcon />
                              </IconButton>
                            </Container>
                       
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              disabled={!shouldShowDelete(user1)}
                              onClick={() =>
                                handleRemoveUserFromMovieList(user1.uid)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          
                        </ListItem>
                        {index < users.length - 1 ? <Divider /> : null}
                      </>
                    ))
                  )}
                </List>
              ) : ( //Desktop view
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!users ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user1, index) => (
                        <TableRow key={user1.uid}>
                          <TableCell>{user1.email}</TableCell>
                          <TableCell>
                            {getUserRoles(user1.accessType)}
                          </TableCell>
                          <TableCell align="center">
                          
                              <>
                                <IconButton
                                  edge="end"
                                  aria-label="upgrade"
                                  disabled={!shouldShowPromote(user1)}
                                  onClick={() =>
                                    handleUpdateUserAccessType(
                                      user1.uid,
                                      parseInt(user1.accessType) + 1
                                    )
                                  }
                                >
                                  <ArrowDropUpIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="downgrade"
                                  disabled={!shouldShowDemote(user1)}
                                  onClick={() =>
                                    handleUpdateUserAccessType(
                                      user1.uid,
                                      parseInt(user1.accessType) - 1
                                    )
                                  }
                                >
                                  <ArrowDropDownIcon />
                                </IconButton>
                              </>
                            
                            
                       
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                disabled={!shouldShowDelete(user1)}
                                onClick={() =>
                                  handleRemoveUserFromMovieList(user1.uid)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              alignContent="center"
              alignItems="center"
              sx={{
                margin: ".5em",
                borderRadius: "5px",
                border: 1, borderColor: "divider",
                padding: ".5em",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Add by email"
                    placeholder="friend@example.com"
                    helperText="They need a Watchlist account. They'll join as a Viewer."
                    value={memberEmail}
                    onChange={(event) => setMemberEmail(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleAddUserToMovieList()}
                    disabled={accessType < 2 || isAddingMember}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAddUserToMovieList}
                    sx={{ marginTop: "1em" }}
                    disabled={accessType < 2 || isAddingMember || !memberEmail.trim()}
                  >
                    Add member
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MovieListSettings;
