import styles from "./loadingGrid.module.css";
export default function LoadingGrid() {
  return (
    <div className={styles.ldsGridContainer}>
      <div className={styles.ldsGrid}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
