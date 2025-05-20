"use client";
import TextArea from "antd/es/input/TextArea";
import styles from "./form-component.module.scss";
import { Form, Button, Select } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "nextjs-toploader/app";
import { logout } from "@/module/auth/service/auth";

const Input = dynamic(() => import("antd").then((mod) => mod.Input), {
  ssr: false,
});
const DatePicker = dynamic(() => import("antd").then((mod) => mod.DatePicker), {
  ssr: false,
});

const FormComponent = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log("Received values:", values);
    // Add your submission logic here
  };

  const handleListPatient = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.headr}>
        <Button className={styles.logout} type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Form
        form={form}
        name="patient-registration"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
        scrollToFirstError
      >
        <div className={styles.head}>Patient Registration</div>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input className={styles.input} placeholder="John Doe" />
        </Form.Item>

        <div className={styles.divRow}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className={styles.input} placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number!",
              },
            ]}
          >
            <Input className={styles.input} placeholder="9876543210" />
          </Form.Item>
        </div>

        <div className={styles.divRow}>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth!" },
            ]}
          >
            <DatePicker
              className={styles.datePicker}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              inputReadOnly
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select className={styles.select} placeholder="Select gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <TextArea
            className={styles.inputArea}
            rows={3}
            placeholder="Street, City, State, ZIP Code"
          />
        </Form.Item>

        <Form.Item label="Medical History" name="medicalHistory">
          <TextArea
            className={styles.inputArea}
            rows={4}
            placeholder="List any previous medical conditions, allergies, or current medications"
          />
        </Form.Item>

        <Form.Item>
          <div className={styles.buttonWrapper}>
            <Button
              className={styles.button}
              type="primary"
              htmlType="submit"
              size="large"
            >
              Register
            </Button>
          </div>
        </Form.Item>
        <Button
          className={styles.buttonCheck}
          onClick={handleListPatient}
          type="dashed"
          size="large"
        >
          Check patients details
        </Button>
      </Form>
    </div>
  );
};

export default FormComponent;
