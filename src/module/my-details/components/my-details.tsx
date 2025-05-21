"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Table, Tag, Button, Form, App } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./my-details.module.scss";
import { useRouter } from "nextjs-toploader/app";
import { logout } from "@/module/auth/service/auth";
import { useListPatients } from "../services/list-patients-service";
import TextArea from "antd/es/input/TextArea";
import { useUpdatePatient } from "../services/update-patient-service";
import { useDeletePatient } from "../services/delete-patient-service";

const { useApp } = App;

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

const { Column } = Table;

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  status: "Active" | "Inactive" | "Pending";
  gender: string;
  address: string;
  medicalHistory: string;
  registeredDate: Date;
}

const MyDetails = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { patients, loading, error, loadPatients } = useListPatients();
  const {
    deletePatient,
    loading: deleteLoading,
    error: deleteError,
  } = useDeletePatient();
  const {
    updatePatient,
    loading: updateLoading,
    error: updateError,
  } = useUpdatePatient();
  const [form] = Form.useForm();
  const route = useRouter();
  const { message } = useApp();
  // Simulated data fetch
  useEffect(() => {
    loadPatients();
  }, []);

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      ...patient,
      dob: dayjs(patient.dob),
    });
    setIsModalVisible(true);
  };

  const handleLogout = async () => {
    await logout();
    route.push("/");
  };

  const handleUpdate = async (values: Patient) => {
    if (!selectedPatient) return;

    try {
      const updatedPatient = {
        id: selectedPatient.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: dayjs(values.dob).toDate(),
        gender: values.gender,
        address: values.address,
        medicalHistory: values.medicalHistory,
        status: values.status,
        registeredDate: selectedPatient.registeredDate,
      };

      const success = await updatePatient(updatedPatient);
      if (success) {
        message.success("Patient updated successfully");
        setIsModalVisible(false);
        loadPatients(); // Refresh patient list
      } else {
        message.error(updateError || "Failed to update patient");
      }
    } catch (error) {
      message.error("Error updating patient");
    }
  };

  const handleDelete = async () => {
    if (!selectedPatient) return;

    try {
      const success = await deletePatient(selectedPatient.id);
      if (success) {
        message.success("Patient deleted successfully");
        setIsModalVisible(false);
        loadPatients();
      } else {
        message.error(deleteError || "Failed to delete patient");
      }
    } catch (error) {
      message.error("Error deleting patient");
    }
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <Button className={styles.register} type="dashed" href="/register">
          Register
        </Button>
        <Button className={styles.logout} type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className={styles.top}>
        <h1>We-Care</h1>
        <h3>Patient Dashboard</h3>
      </div>
      <div className={styles.body}>
        <Table
          dataSource={patients as readonly Patient[]}
          locale={{
            emptyText: <span className="text-gray-500">No patients found</span>,
          }}
          rowKey={(record) => record.id}
          loading={!patients.length}
          onRow={(record: Patient) => ({
            onClick: () => handleRowClick(record),
          })}
          className="cursor-pointer"
        >
          <Column
            title="Name"
            dataIndex="name"
            key="name-column"
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
            key="email-column"
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
            key="phone-column"
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
            key="status-column"
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
            key="dob-column"
            render={(date) => date.toLocaleDateString()}
          />
          <Column
            title="Registered Date"
            dataIndex="registeredDate"
            key="registeredDate-column"
            render={(date) => date.toLocaleDateString()}
          />
        </Table>

        <Modal
          className={styles.modal}
          centered
          title={
            <span className={styles.modalTitle}>Edit Patient Details</span>
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
              rules={[{ required: true, message: "Please enter patient name" }]}
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
              rules={[{ required: true, message: "Please enter phone number" }]}
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
              label="Gender"
              name="gender"
              rules={[{ required: false, message: "Please select gender" }]}
            >
              <Select
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: false, message: "Please enter address" }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Medical History"
              name="medicalHistory"
              rules={[
                { required: false, message: "Please enter medical history" },
              ]}
            >
              <TextArea rows={4} />
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

            <div className={styles.buttonsWrap}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <div className={styles.rightButton}>
                <Button
                  loading={updateLoading}
                  type="primary"
                  htmlType="submit"
                >
                  Update Patient
                </Button>
                <Button
                  className={styles.delete}
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MyDetails;
