"use client";
import { Button, Form, Input } from "antd";
import styles from "./form-box.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { initializeDB } from "@/lib/db";
import { isAuthenticated, login } from "../../service/auth";

type FieldType = {
  email: string;
  password: string;
};

const FormBox = () => {
  const [form] = Form.useForm();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      await initializeDB();

      setIsMounted(true);
    }
    init();
  }, [router]);

  const onFinish = async (values: FieldType) => {
    setError(null);
    const success = await login(values.email, values.password);
    if (success) {
      router.push("/register");
    } else {
      setError("Invalid username or password");
    }
  };

  if (!isMounted) return null;

  return (
    <div className={styles.wrap}>
      <Form
        className={styles.form}
        form={form}
        onFinish={onFinish}
        initialValues={{ remember: true }}
      >
        <div className={styles.title}>Authentication</div>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            data-hydrate="email-input"
            placeholder="Email"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password
            data-hydrate="password-input"
            placeholder="Password"
            className={styles.input}
          />
        </Form.Item>
        {error && <div className={styles.error}>{error}</div>}
        <Form.Item>
          <Button
            data-hydrate="submit-button"
            type="primary"
            htmlType="submit"
            className={styles.button}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormBox;
