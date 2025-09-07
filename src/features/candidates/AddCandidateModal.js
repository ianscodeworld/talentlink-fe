// src/features/candidates/AddCandidateModal.js
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Divider, Typography, message, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { checkDuplicateCandidate } from '../../features/demands/demandSlice';
import DuplicateCandidateModal from './DuplicateCandidateModal';

const AddCandidateModal = ({ open, onCreate, onCancel, demandId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [newCandidateData, setNewCandidateData] = useState(null);
    const [existingCandidate, setExistingCandidate] = useState(null);

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            try {
                console.log('%c[DEBUG] Step 1: Submitting for duplicate check with:', 'color: blue', { name: values.name, demandId });
                const resultAction = await dispatch(checkDuplicateCandidate({ name: values.name, demandId })).unwrap();
                
                // --- START FIX & DEBUG LOGS ---
                console.log('%c[DEBUG] Step 2: Received API response:', 'color: blue', resultAction);

                // FIX 1: Check for the correct property 'duplicate'
                if (resultAction.duplicate && resultAction.matchingCandidates?.length > 0) {
                    console.log('%c[DEBUG] Step 3: Duplicate found. Opening comparison modal.', 'color: green');
                    setNewCandidateData(values);
                    // FIX 2: Get the first candidate from the 'matchingCandidates' array
                    setExistingCandidate(resultAction.matchingCandidates[0]);
                    setIsDuplicateModalOpen(true);
                } else {
                    console.log('%c[DEBUG] Step 3: No duplicate found. Proceeding to create.', 'color: green');
                    form.resetFields();
                    onCreate(values);
                }
                // --- END FIX & DEBUG LOGS ---

            } catch (err) {
                console.error('[DEBUG] Error during duplicate check:', err);
                message.error(`Error checking for duplicates: ${err}`);
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };
    
    // ... rest of the component is unchanged ...
    const handleParse = () => { const pasteData = form.getFieldValue('pasteArea'); if (!pasteData) { message.warning('Please paste data into the text area first.'); return; } const values = pasteData.split('\t').map(item => item.trim()); if (values.length >= 12) { const formData = { vendorName: values[1], name: values[2], gender: values[3], skillset: values[4], seniority: values[5], relatedWorkingExperience: values[6], onboardingTime: values[7], skillHighlights: values[8], englishCapability: values[9], onlineCodingResult: values[10], internalInterviewFeedback: values[11], resumeSummary: `Pasted from source.\nSkill Highlights: ${values[8]}\n\nEnglish Capability: ${values[9]}\n\nOnline Coding Result: ${values[10]}\n\nInternal Interview Feedback: ${values[11]}\n\nRelated Experience: ${values[6]}`, }; form.setFieldsValue(formData); message.success('Data parsed and fields populated!'); } else { message.error(`Pasted data format is incorrect. Expected 12 tab-separated columns, but got ${values.length}.`); } };
    const handleProceedAnyway = () => { form.resetFields(); onCreate(newCandidateData); setIsDuplicateModalOpen(false); };
    return (
        <>
            <Modal open={open} title="Add a New Candidate" okText="Add" cancelText="Cancel" width={800} onCancel={onCancel} onOk={handleOk}>
                <Form form={form} layout="vertical" name="add_candidate_form">
                    <Form.Item name="pasteArea" label="Paste Area"><Input.TextArea rows={3} placeholder="Paste a single table row (tab-separated) here from your source."/></Form.Item>
                    <Button onClick={handleParse} style={{ marginBottom: 24 }}>Parse Pasted Content</Button>
                    <Divider />
                    <Row gutter={16}><Col span={12}><Form.Item name="name" label="Resource Name" rules={[{ required: true, message: 'Resource Name is required!' }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="vendorName" label="Vendor Name" rules={[{ required: true, message: 'Vendor Name is required!' }]}><Input placeholder="Auto-filled by parsing or enter manually" /></Form.Item></Col></Row>
                    <Row gutter={16}><Col span={12}><Form.Item name="gender" label="Gender"><Input /></Form.Item></Col><Col span={12}><Form.Item name="seniority" label="Seniority"><Input /></Form.Item></Col></Row>
                    <Row gutter={16}><Col span={12}><Form.Item name="englishCapability" label="English Capability"><Input /></Form.Item></Col><Col span={12}><Form.Item name="onboardingTime" label="Onboarding Time"><Input /></Form.Item></Col></Row>
                    <Form.Item name="skillset" label="Skillset"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                    <Form.Item name="skillHighlights" label="Skill Highlights"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                    <Form.Item name="relatedWorkingExperience" label="Related Working Experience"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                    <Form.Item name="onlineCodingResult" label="Online Coding Result"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                    <Form.Item name="internalInterviewFeedback" label="Internal Interview Feedback"><Input.TextArea autoSize={{ minRows: 2 }} /></Form.Item>
                    <Form.Item name="resumeSummary" label="Generated Resume Summary"><Input.TextArea autoSize={{ minRows: 5 }} readOnly /></Form.Item>
                </Form>
            </Modal>
            {isDuplicateModalOpen && ( <DuplicateCandidateModal open={isDuplicateModalOpen} onProceed={handleProceedAnyway} onCancel={() => setIsDuplicateModalOpen(false)} newCandidateData={newCandidateData} existingCandidate={existingCandidate} /> )}
        </>
    );
};
export default AddCandidateModal;