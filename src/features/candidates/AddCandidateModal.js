// src/features/candidates/AddCandidateModal.js
import React from 'react';
import { Modal, Form, Input, Select, Divider, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const AddCandidateModal = ({ open, onCreate, onCancel, vendors, loading }) => {
    const [form] = Form.useForm();

    const handlePaste = (event) => {
        // 阻止默认的粘贴行为
        event.preventDefault();
        // 从剪贴板获取纯文本数据
        const pastedText = event.clipboardData.getData('text/plain');
        // 按 Tab 分隔符将文本拆分为数组
        const values = pastedText.split('\t').map(item => item.trim());

        // 根据需求文档中的列顺序进行映射
        // |0 Date|1 Resource Name|2 Gender|3 Skillset|4 Seniority|5 Related Working Experience|
        // |6 Onboarding Time|7 Skill Highlights|8 English Capability|9 Internal Interview feedback|10 Online coding result|
        // 最后一列 "CV screen result" 不录入

        if (values.length >= 11) {
            const formData = {
                name: values[1],
                gender: values[2],
                skillset: values[3],
                seniority: values[4],
                relatedWorkingExperience: values[5],
                onboardingTime: values[6],
                skillHighlights: values[7],
                englishCapability: values[8],
                internalInterviewFeedback: values[9],
                onlineCodingResult: values[10],
                // 多个字段可以合并到 resumeSummary 中，方便统一查看
                resumeSummary: `Skill Highlights: ${values[7]}\n\nEnglish Capability: ${values[8]}\n\nInternal Interview Feedback: ${values[9]}\n\nOnline Coding Result: ${values[10]}`,
            };

            // 使用 antd form API 自动填充表单
            form.setFieldsValue(formData);
        }
    };

    return (
        <Modal
            open={open}
            title="Add a New Candidate"
            okText="Add"
            cancelText="Cancel"
            width={800} // 加宽模态框以容纳更多字段
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="add_candidate_form">
                <Text type="secondary">
                    You can paste a table row (tab-separated) from email or Excel into the box below to auto-fill the form.
                </Text>
                <Input.TextArea 
                    rows={2} 
                    placeholder="Paste candidate data here" 
                    onPaste={handlePaste} 
                    style={{ margin: '8px 0 24px 0' }}
                />
                
                <Divider />

                <Form.Item
                    name="name"
                    label="Candidate Name"
                    rules={[{ required: true, message: 'Please input the candidate name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="vendorId"
                    label="Vendor"
                    rules={[{ required: true, message: 'Please select a vendor!' }]}
                >
                    <Select placeholder="Select a vendor" loading={loading}>
                        {vendors.map(vendor => (
                            <Option key={vendor.id} value={vendor.id}>
                                {vendor.companyName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* --- 新增字段 --- */}
                <Form.Item name="gender" label="Gender"><Input /></Form.Item>
                <Form.Item name="skillset" label="Skillset"><Input /></Form.Item>
                <Form.Item name="seniority" label="Seniority"><Input /></Form.Item>
                <Form.Item name="relatedWorkingExperience" label="Related Working Experience"><Input.TextArea /></Form.Item>
                <Form.Item name="onboardingTime" label="Onboarding Time"><Input /></Form.Item>
                <Form.Item name="skillHighlights" label="Skill Highlights"><Input.TextArea /></Form.Item>
                <Form.Item name="englishCapability" label="English Capability"><Input /></Form.Item>
                <Form.Item name="internalInterviewFeedback" label="Internal Interview Feedback"><Input.TextArea /></Form.Item>
                <Form.Item name="onlineCodingResult" label="Online Coding Result"><Input /></Form.Item>
                {/* --- 简历总结字段保留，用于手动输入或由粘贴逻辑填充 --- */}
                <Form.Item name="resumeSummary" label="Resume Summary">
                    <Input.TextArea rows={6} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCandidateModal;