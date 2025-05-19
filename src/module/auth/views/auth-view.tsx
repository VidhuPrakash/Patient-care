import FormBox from "../components/form-box/form-box";
import styles from "./auth-view.module.scss";

const AuthView = () => {
  return (
    <div className={styles.wrap}>
      <FormBox />
    </div>
  );
};

export default AuthView;
