
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Modal, Button, Form } from 'react-bootstrap';
import { changePassword } from '../redux/slices/authSlice';

const PasswordModal = ({
    show,
    onHide,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    dispatch
}) => {
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match!");
            return;
        }
        try {
            await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
            onHide();
            toast.success("Password changed successfully!");
        } catch (err) {
            console.error('Error changing password:', err);
            toast.error(err?.message || "Error changing password");
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Change Password
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PasswordModal;