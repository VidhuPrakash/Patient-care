import FormBox from "../components/form-box/form-box";
import styles from "./auth-view.module.scss";

const AuthView = () => {
  return (
    <div className={styles.wrap}>
      <FormBox />
      <div className={styles.content}>
        <div className={styles.title}>We-Care</div>
        <span>Manage your patients easily</span>
      </div>
    </div>
  );
};

export default AuthView;
