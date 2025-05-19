"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Layout,
  Card,
  Table,
  Tag,
  Button,
  Skeleton,
  message,
  Form,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Dynamic imports for SSR-sensitive components
const Modal = dynamic(() => import("antd").then((mod) => mod.Modal), {
  ssr: false,
});
const Input = dynamic(() => import("antd").then((mod) => mod.Input), {
  ssr: false,
});
const DatePicker = dynamic(() => import("antd").then((mod) => mod.DatePicker), {
  ssr: false,
});
const Select = dynamic(() => import("antd").then((mod) => mod.Select), {
  ssr: false,
});

const { Content } = Layout;
const { Column } = Table;

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  status: "Active" | "Inactive" | "Pending";
  registeredDate: Date;
}

const PatientsDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Simulated data fetch
  useEffect(() => {
    setTimeout(() => {
      setPatients([
        {
          id: "PAT-001",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          dob: new Date("1985-04-23"),
          status: "Active",
          registeredDate: new Date("2023-01-15"),
        },
        // Add more sample patients...
      ]);
    }, 1500);
  }, []);

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      ...patient,
      dob: dayjs(patient.dob),
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient?.id
            ? { ...values, dob: values.dob.toDate() }
            : p
        )
      );

      message.success("Patient updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error updating patient");
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="p-8 bg-gray-50">
        <Card
          title={
            <span className="text-xl font-semibold">Patient Management</span>
          }
          className="shadow-lg"
        >
          <Table
            dataSource={patients}
            rowKey="id"
            loading={!patients.length}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            className="cursor-pointer"
          >
            <Column
              title="Name"
              dataIndex="name"
              key="name"
              render={(text, record: Patient) => (
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-blue-500" />
                  <span className="font-medium">{text}</span>
                </div>
              )}
            />
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              render={(text) => (
                <div className="flex items-center gap-2">
                  <MailOutlined />
                  <span>{text}</span>
                </div>
              )}
            />
            <Column
              title="Phone"
              dataIndex="phone"
              key="phone"
              render={(text) => (
                <div className="flex items-center gap-2">
                  <PhoneOutlined />
                  <span>{text}</span>
                </div>
              )}
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status) => (
                <Tag
                  color={
                    status === "Active"
                      ? "green"
                      : status === "Pending"
                      ? "orange"
                      : "red"
                  }
                >
                  {status}
                </Tag>
              )}
            />
            <Column
              title="Date of Birth"
              dataIndex="dob"
              key="dob"
              render={(date) => date.toLocaleDateString()}
            />
            <Column
              title="Registered Date"
              dataIndex="registeredDate"
              key="registeredDate"
              render={(date) => date.toLocaleDateString()}
            />
          </Table>

          <Modal
            title={
              <span className="text-lg font-semibold">
                Edit Patient Details
              </span>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdate}
              className="pt-4"
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter patient name" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Pending", label: "Pending" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
              </Form.Item>

              <div className="flex justify-end gap-4 mt-6">
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Update Patient
                </Button>
              </div>
            </Form>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PatientsDashboard;
