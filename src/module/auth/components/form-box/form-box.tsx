"use client";
import { Button, Form, Input } from "antd";
import styles from "./form-box.module.scss";

const FormBox = () => {
  return (
    <div className={styles.wrap}>
      <Form>
        <div className={styles.title}>Authentication</div>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" className={styles.input} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input placeholder="Password" className={styles.input} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.button}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormBox;
