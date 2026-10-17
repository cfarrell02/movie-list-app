import React, { useEffect, useState } from 'react';
import { Alert, Card, Typography, Button, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode, applyActionCode } from "firebase/auth";


const allowedModes = ['resetPassword', 'verifyEmail', 'recoverEmail'];

const UserActionPage = () => {
    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const mode = urlSearch.get('mode');
    const oobCode = urlSearch.get('oobCode');
    const navigate = useNavigate();
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!allowedModes.includes(mode)) {
            navigate('/404');
        } else if (mode === 'resetPassword' && oobCode) {
            // Verify reset code
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => {
                    setEmail(email);
                })
                .catch((error) => {
                    setError('Invalid or expired action code.');
                });
        }
    }, [mode, oobCode, navigate, auth]);

    const handlePasswordReset = () => {
        confirmPasswordReset(auth, oobCode, newPassword)
            .then(() => {
                setSuccess('Password has been reset successfully.');
            })
            .catch((error) => {
                setError('Error resetting password. Please try again.');
            });
    };

    const handleVerifyEmail = () => {
        applyActionCode(auth, oobCode)
            .then(() => {
                setSuccess('Email has been verified successfully.');
            })
            .catch((error) => {
                setError('Error verifying email. Please try again.');
            });
    };

    const handleRecoverEmail = async () => {
        try {
            await applyActionCode(auth, oobCode);
            setSuccess('Email has been recovered successfully.');
        } catch (error) {
            setError('Error recovering email. Please try again.');
        }
    };

    return (
        <Card sx={{ maxWidth: 480, mx: 'auto', my: { xs: 4, md: 10 }, p: { xs: 3, sm: 5 } }}>
            <Typography variant="overline" color="primary" fontWeight={700}>
                Watchlist
            </Typography>
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

            {mode === 'resetPassword' && (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Reset Password
                    </Typography>
                    {email && <Typography variant="body1">Resetting password for: {email}</Typography>}
                    <TextField
                        id="new-password"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                </>
            )}

            {mode === 'verifyEmail' && (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Verify Email
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={handleVerifyEmail}>
                        Confirm Email Verification
                    </Button>
                </>
            )}

            {mode === 'recoverEmail' && (
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Recover Email
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth onClick={handleRecoverEmail}>
                        Confirm Email Recovery
                    </Button>
                </>
            )}
        </Card>
    );
};

export default UserActionPage;
