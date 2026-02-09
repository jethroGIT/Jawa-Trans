-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema new-jawatrans
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema new-jawatrans
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `new-jawatrans` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `new-jawatrans` ;

-- -----------------------------------------------------
-- Table `new-jawatrans`.`mitra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`mitra` (
  `idMitra` INT NOT NULL AUTO_INCREMENT,
  `logo` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `alamat` VARCHAR(500) NOT NULL,
  `telephone` INT NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT '1' COMMENT '0 = tidak aktif\\n1 = aktif',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idMitra`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`jenis_kendaraan`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`jenis_kendaraan` (
  `idTipe` INT NOT NULL AUTO_INCREMENT,
  `idMitra` INT NOT NULL,
  `tipe` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idTipe`),
  INDEX `fk_Tipe_Mitra_idx` (`idMitra` ASC) VISIBLE,
  CONSTRAINT `fk_Tipe_Mitra`
    FOREIGN KEY (`idMitra`)
    REFERENCES `new-jawatrans`.`mitra` (`idMitra`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`bus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`bus` (
  `idBus` INT NOT NULL AUTO_INCREMENT,
  `idTipe` INT NOT NULL,
  `plat_nomor` VARCHAR(10) NOT NULL,
  `kode_bus` VARCHAR(10) NOT NULL,
  `kapasitas` INT NOT NULL,
  `status` TINYINT NOT NULL DEFAULT '1' COMMENT '0 = tidak aktif\\n1 = aktif\n2 = perbaikan',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idBus`),
  INDEX `fk_Bus_Tipe_idx` (`idTipe` ASC) VISIBLE,
  CONSTRAINT `fk_Bus_Tipe`
    FOREIGN KEY (`idTipe`)
    REFERENCES `new-jawatrans`.`jenis_kendaraan` (`idTipe`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`fasilitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`fasilitas` (
  `idFasilitas` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idFasilitas`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`bus_fasilitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`bus_fasilitas` (
  `idTipe` INT NOT NULL,
  `idFasilitas` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idTipe`, `idFasilitas`),
  INDEX `fk_Bus_Fasilitas_2_idx` (`idFasilitas` ASC) VISIBLE,
  INDEX `fk_Bus_Fasilitas_1_idx` (`idTipe` ASC) VISIBLE,
  CONSTRAINT `fk_Bus_Fasilitas_1`
    FOREIGN KEY (`idTipe`)
    REFERENCES `new-jawatrans`.`jenis_kendaraan` (`idTipe`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bus_Fasilitas_2`
    FOREIGN KEY (`idFasilitas`)
    REFERENCES `new-jawatrans`.`fasilitas` (`idFasilitas`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`customer` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `alamat` VARCHAR(500) NOT NULL,
  `telephone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`role` (
  `idRole` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idRole`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`employee` (
  `idEmployee` INT NOT NULL AUTO_INCREMENT,
  `idMitra` INT NOT NULL,
  `idRole` INT NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `nik` INT NOT NULL,
  `alamat` VARCHAR(500) NOT NULL,
  `telephone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT '1' COMMENT '0 = tidak aktif\\n1 = aktif',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idEmployee`),
  INDEX `fk_employee_role_idx` (`idRole` ASC) VISIBLE,
  INDEX `fk_employee_mitra_idx` (`idMitra` ASC) VISIBLE,
  CONSTRAINT `fk_employee_mitra`
    FOREIGN KEY (`idMitra`)
    REFERENCES `new-jawatrans`.`mitra` (`idMitra`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_employee_role`
    FOREIGN KEY (`idRole`)
    REFERENCES `new-jawatrans`.`role` (`idRole`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`foto_bus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`foto_bus` (
  `idFoto_Bus` INT NOT NULL AUTO_INCREMENT,
  `idTipe` INT NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idFoto_Bus`),
  INDEX `fk_Foto_Bus_idx` (`idTipe` ASC) VISIBLE,
  CONSTRAINT `fk_Foto_Bus`
    FOREIGN KEY (`idTipe`)
    REFERENCES `new-jawatrans`.`jenis_kendaraan` (`idTipe`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`terminal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`terminal` (
  `idTerminal` INT NOT NULL AUTO_INCREMENT,
  `kota` VARCHAR(45) NOT NULL,
  `nama` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idTerminal`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`jadwal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`jadwal` (
  `idJadwal` INT NOT NULL AUTO_INCREMENT,
  `idBus` INT NOT NULL,
  `titik_naik` INT NOT NULL,
  `titik_turun` INT NOT NULL,
  `tanggal_keberangkatan` DATE NOT NULL,
  `jam_keberangkatan` DATETIME NOT NULL,
  `tanggal_kedatangan` DATE NOT NULL,
  `jam_kedatangan` DATETIME NOT NULL,
  `harga` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idJadwal`),
  INDEX `fk_Jadwal_Bus_idx` (`idBus` ASC) VISIBLE,
  INDEX `fk_Jadwal_Asal_idx` (`titik_naik` ASC) VISIBLE,
  INDEX `fk_Jadwal_Tujuan_idx` (`titik_turun` ASC) VISIBLE,
  CONSTRAINT `fk_Jadwal_Asal`
    FOREIGN KEY (`titik_naik`)
    REFERENCES `new-jawatrans`.`terminal` (`idTerminal`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Jadwal_Bus`
    FOREIGN KEY (`idBus`)
    REFERENCES `new-jawatrans`.`bus` (`idBus`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Jadwal_Tujuan`
    FOREIGN KEY (`titik_turun`)
    REFERENCES `new-jawatrans`.`terminal` (`idTerminal`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`reservasi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`reservasi` (
  `idReservasi` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `method` VARCHAR(45) NOT NULL,
  `hargaSatuan` INT NOT NULL,
  `waktuBayar` TIMESTAMP NULL DEFAULT NULL,
  `status` TINYINT NOT NULL DEFAULT '0' COMMENT '0 = pending\\n1 = paid\\n2 = expire',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idReservasi`),
  INDEX `fk_Reservasi_Users_idx` (`idUser` ASC) VISIBLE,
  CONSTRAINT `fk_Reservasi_Users`
    FOREIGN KEY (`idUser`)
    REFERENCES `new-jawatrans`.`customer` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`reservasidetail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`reservasidetail` (
  `idJadwal` INT NOT NULL,
  `idReservasi` INT NOT NULL,
  `noKursi` INT NOT NULL,
  `namaPenumpang` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idJadwal`, `idReservasi`, `noKursi`),
  INDEX `fk_ReservasiDetail_Reservasi_idx` (`idReservasi` ASC) VISIBLE,
  CONSTRAINT `fk_Jadwal`
    FOREIGN KEY (`idJadwal`)
    REFERENCES `new-jawatrans`.`jadwal` (`idJadwal`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ReservasiDetail_Reservasi`
    FOREIGN KEY (`idReservasi`)
    REFERENCES `new-jawatrans`.`reservasi` (`idReservasi`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `new-jawatrans`.`superAdmin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `new-jawatrans`.`superAdmin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
