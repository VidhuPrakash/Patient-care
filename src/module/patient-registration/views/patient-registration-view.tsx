import FormComponent from "../components/form/form-component";
import SideBar from "../components/side-bar/side-bar";
import styles from "./patient-registration-view.module.scss";

const PatientRegistrationView = () => {
  return (
    <div className={styles.wrap}>
      <SideBar />
      <FormComponent />
    </div>
  );
};

export default PatientRegistrationView;
