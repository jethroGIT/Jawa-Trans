CREATE DATABASE  IF NOT EXISTS `Jawa-Trans` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `Jawa-Trans`;
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: Jawa-Trans
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Bus`
--

DROP TABLE IF EXISTS `Bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bus` (
  `idBus` int NOT NULL AUTO_INCREMENT,
  `idMitra` int NOT NULL,
  `kode_bus` varchar(10) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `kapasitas` int DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idBus`),
  KEY `fk_Bus_Mitra_idx` (`idMitra`),
  CONSTRAINT `fk_Bus_Mitra` FOREIGN KEY (`idMitra`) REFERENCES `Mitra` (`idMitra`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bus`
--

LOCK TABLES `Bus` WRITE;
/*!40000 ALTER TABLE `Bus` DISABLE KEYS */;
INSERT INTO `Bus` VALUES (1,1,'BUS-001','PO Harapan Jaya','Mini Bus',20,'Aktif','2025-08-15 13:53:35','2025-09-01 08:39:44'),(2,2,'BUS-002','PO Sinar Jaya','Mini Bus',20,'Aktif','2025-08-15 14:38:49','2025-09-01 08:41:46'),(3,1,'BUS-003','PO Rosalia Indah','Bus',200,'Aktif','2025-08-16 04:58:59','2025-09-01 08:44:08'),(4,1,'BUS-004','PO Cahaya Baru','Bus',200,'Aktif','2025-08-16 07:35:54','2025-09-01 08:46:02');
/*!40000 ALTER TABLE `Bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bus_Fasilitas`
--

DROP TABLE IF EXISTS `Bus_Fasilitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bus_Fasilitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idBus` int DEFAULT NULL,
  `idFasilitas` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Bus_Fasilitas_1_idx` (`idBus`),
  KEY `fk_Bus_Fasilitas_2_idx` (`idFasilitas`),
  CONSTRAINT `fk_Bus_Fasilitas_1` FOREIGN KEY (`idBus`) REFERENCES `Bus` (`idBus`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Bus_Fasilitas_2` FOREIGN KEY (`idFasilitas`) REFERENCES `Fasilitas` (`idFasilitas`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bus_Fasilitas`
--

LOCK TABLES `Bus_Fasilitas` WRITE;
/*!40000 ALTER TABLE `Bus_Fasilitas` DISABLE KEYS */;
INSERT INTO `Bus_Fasilitas` VALUES (1,1,1,'2025-08-15 14:10:06','2025-08-15 21:10:06'),(2,1,3,'2025-08-15 14:10:06','2025-08-15 21:10:06'),(3,3,1,'2025-08-16 04:58:59','2025-08-16 04:58:59'),(4,3,3,'2025-08-16 04:58:59','2025-08-16 04:58:59'),(9,2,1,'2025-09-01 08:41:46','2025-09-01 08:41:46'),(10,2,2,'2025-09-01 08:41:46','2025-09-01 08:41:46'),(11,4,2,'2025-09-01 08:46:02','2025-09-01 08:46:02'),(12,4,3,'2025-09-01 08:46:02','2025-09-01 08:46:02');
/*!40000 ALTER TABLE `Bus_Fasilitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Fasilitas`
--

DROP TABLE IF EXISTS `Fasilitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Fasilitas` (
  `idFasilitas` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idFasilitas`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Fasilitas`
--

LOCK TABLES `Fasilitas` WRITE;
/*!40000 ALTER TABLE `Fasilitas` DISABLE KEYS */;
INSERT INTO `Fasilitas` VALUES (1,'AC','2025-08-15 12:21:26','2025-08-15 12:21:26'),(2,'CCTV','2025-08-15 12:22:27','2025-08-15 12:22:27'),(3,'Kursi Luas','2025-08-15 12:23:01','2025-08-15 12:24:28'),(4,'Rexona','2025-08-23 16:00:04','2025-08-23 16:00:04');
/*!40000 ALTER TABLE `Fasilitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Foto_Bus`
--

DROP TABLE IF EXISTS `Foto_Bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Foto_Bus` (
  `idFoto_Bus` int NOT NULL,
  `idBus` int NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idFoto_Bus`),
  KEY `fk_Foto_Bus_idx` (`idBus`),
  CONSTRAINT `fk_Foto_Bus` FOREIGN KEY (`idBus`) REFERENCES `Bus` (`idBus`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Foto_Bus`
--

LOCK TABLES `Foto_Bus` WRITE;
/*!40000 ALTER TABLE `Foto_Bus` DISABLE KEYS */;
/*!40000 ALTER TABLE `Foto_Bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Jadwal`
--

DROP TABLE IF EXISTS `Jadwal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Jadwal` (
  `idJadwal` int NOT NULL AUTO_INCREMENT,
  `idBus` int NOT NULL,
  `titik_naik` int NOT NULL,
  `titik_turun` int NOT NULL,
  `tanggal_keberangkatan` date NOT NULL,
  `jam_keberangkatan` datetime NOT NULL,
  `tanggal_kedatangan` date NOT NULL,
  `jam_kedatangan` datetime NOT NULL,
  `harga` decimal(10,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idJadwal`),
  KEY `fk_Jadwal_Bus_idx` (`idBus`),
  KEY `fk_Jadwal_Asal_idx` (`titik_naik`),
  KEY `fk_Jadwal_Tujuan_idx` (`titik_turun`),
  CONSTRAINT `fk_Jadwal_Asal` FOREIGN KEY (`titik_naik`) REFERENCES `Terminal` (`idTerminal`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Jadwal_Bus` FOREIGN KEY (`idBus`) REFERENCES `Bus` (`idBus`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Jadwal_Tujuan` FOREIGN KEY (`titik_turun`) REFERENCES `Terminal` (`idTerminal`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Jadwal`
--

LOCK TABLES `Jadwal` WRITE;
/*!40000 ALTER TABLE `Jadwal` DISABLE KEYS */;
INSERT INTO `Jadwal` VALUES (7,1,1,2,'2025-08-30','2025-08-30 01:30:00','2025-08-31','2025-08-31 05:00:00',150000,'2025-08-25 12:08:27','2025-08-25 12:08:27'),(8,2,2,1,'2025-08-30','2025-08-30 01:30:00','2025-08-31','2025-08-31 05:00:00',150000,'2025-08-25 12:34:13','2025-08-25 12:34:13');
/*!40000 ALTER TABLE `Jadwal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kursi`
--

DROP TABLE IF EXISTS `Kursi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Kursi` (
  `idKursi` int NOT NULL AUTO_INCREMENT,
  `idBus` int NOT NULL,
  `noKursi` varchar(10) DEFAULT NULL,
  `tipe` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idKursi`),
  KEY `fk_Kursi_Bus_idx` (`idBus`),
  CONSTRAINT `fk_Kursi_Bus` FOREIGN KEY (`idBus`) REFERENCES `Bus` (`idBus`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kursi`
--

LOCK TABLES `Kursi` WRITE;
/*!40000 ALTER TABLE `Kursi` DISABLE KEYS */;
INSERT INTO `Kursi` VALUES (1,1,'S1','supir','2025-09-01 13:33:50','2025-09-04 04:42:02'),(2,1,'A001','penumpang','2025-09-04 03:04:36','2025-09-07 13:14:49'),(3,1,'A002','penumpang','2025-09-07 13:15:24','2025-09-07 13:15:24'),(4,1,'A003','penumpang','2025-09-07 13:15:30','2025-09-07 13:15:30'),(5,1,'A004','penumpang','2025-09-07 13:15:34','2025-09-07 13:15:34'),(6,1,'A005','penumpang','2025-09-07 13:15:38','2025-09-07 13:15:38'),(7,1,'A006','penumpang','2025-09-10 12:23:17','2025-09-10 12:23:17'),(8,1,'A007','penumpang','2025-09-10 12:23:22','2025-09-10 12:23:22'),(9,1,'A008','penumpang','2025-09-10 12:23:27','2025-09-10 12:23:27'),(10,1,'A009','penumpang','2025-09-10 12:23:31','2025-09-10 12:23:31'),(11,1,'A0010','penumpang','2025-09-10 12:23:36','2025-09-10 12:23:36'),(12,1,'A0011','penumpang','2025-09-10 12:23:42','2025-09-10 12:23:42'),(13,1,'A0012','penumpang','2025-09-10 12:23:49','2025-09-10 12:23:49'),(14,2,'S1','supir','2025-09-10 12:24:32','2025-09-10 12:24:32'),(15,2,'A001','penumpang','2025-09-10 12:24:51','2025-09-10 12:24:51'),(16,2,'A002','penumpang','2025-09-10 12:24:57','2025-09-10 12:24:57'),(17,2,'A003','penumpang','2025-09-10 12:25:01','2025-09-10 12:25:01'),(18,2,'A004','penumpang','2025-09-10 12:25:05','2025-09-10 12:25:05'),(19,2,'A005','penumpang','2025-09-10 12:25:10','2025-09-10 12:25:10');
/*!40000 ALTER TABLE `Kursi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mitra`
--

DROP TABLE IF EXISTS `Mitra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mitra` (
  `idMitra` int NOT NULL AUTO_INCREMENT,
  `logo` varchar(255) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `alamat` text,
  `telephone` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idMitra`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mitra`
--

LOCK TABLES `Mitra` WRITE;
/*!40000 ALTER TABLE `Mitra` DISABLE KEYS */;
INSERT INTO `Mitra` VALUES (1,'@','PO Haryanto','Bumi',333,'po.haryanto@gmail.com','2025-08-12 17:51:05','2025-08-23 15:50:49'),(2,'*','PO Budy','Bumi',111,'po.budy@gmail.com','2025-08-12 17:57:02','2025-08-12 17:57:02');
/*!40000 ALTER TABLE `Mitra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `idPayment` int NOT NULL AUTO_INCREMENT,
  `idReservasi` int DEFAULT NULL,
  `idmethodPayment` int DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `totalBayar` int DEFAULT NULL,
  `waktuBayar` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idPayment`),
  KEY `fk_Payment_Method_idx` (`idmethodPayment`),
  KEY `fk_Payment_Reservasi_idx` (`idReservasi`),
  CONSTRAINT `fk_Payment_Method` FOREIGN KEY (`idmethodPayment`) REFERENCES `methodPayment` (`idmethodPayment`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Payment_Reservasi` FOREIGN KEY (`idReservasi`) REFERENCES `Reservasi` (`idReservasi`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES (2,5,1,'pending',10000,'2025-04-01 02:00:00','2025-09-11 01:37:57','2025-09-11 01:37:57');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservasi`
--

DROP TABLE IF EXISTS `Reservasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reservasi` (
  `idReservasi` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `idJadwal` int NOT NULL,
  `penumpang` int NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idReservasi`),
  KEY `fk_Reservasi_Jadwal_idx` (`idJadwal`),
  KEY `fk_Reservasi_Users_idx` (`idUser`),
  CONSTRAINT `fk_Reservasi_Jadwal` FOREIGN KEY (`idJadwal`) REFERENCES `Jadwal` (`idJadwal`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservasi_Users` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservasi`
--

LOCK TABLES `Reservasi` WRITE;
/*!40000 ALTER TABLE `Reservasi` DISABLE KEYS */;
INSERT INTO `Reservasi` VALUES (5,4,7,2,'pending','2025-09-08 14:27:53','2025-09-08 14:27:53'),(6,2,7,2,'pending','2025-09-09 14:59:05','2025-09-09 14:59:05'),(9,2,8,2,'pending','2025-09-10 12:25:28','2025-09-10 12:25:28');
/*!40000 ALTER TABLE `Reservasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReservasiDetail`
--

DROP TABLE IF EXISTS `ReservasiDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReservasiDetail` (
  `idDetail` int NOT NULL AUTO_INCREMENT,
  `idReservasi` int NOT NULL,
  `noKursi` varchar(10) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idDetail`),
  KEY `fk_ReservasiDetail_Reservasi_idx` (`idReservasi`),
  CONSTRAINT `fk_ReservasiDetail_Reservasi` FOREIGN KEY (`idReservasi`) REFERENCES `Reservasi` (`idReservasi`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReservasiDetail`
--

LOCK TABLES `ReservasiDetail` WRITE;
/*!40000 ALTER TABLE `ReservasiDetail` DISABLE KEYS */;
INSERT INTO `ReservasiDetail` VALUES (1,5,'A001','pending','2025-09-08 14:27:53','2025-09-08 14:27:53'),(2,5,'A002','pending','2025-09-08 14:27:53','2025-09-08 14:27:53'),(3,6,'A003','pending','2025-09-09 14:59:05','2025-09-09 14:59:05'),(4,6,'A004','pending','2025-09-09 14:59:05','2025-09-09 14:59:05'),(9,9,'A001','pending','2025-09-10 12:25:28','2025-09-10 12:25:28'),(10,9,'A002','pending','2025-09-10 12:25:28','2025-09-10 12:25:28');
/*!40000 ALTER TABLE `ReservasiDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `idRole` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idRole`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'admin','2025-08-04 03:24:12','2025-08-04 03:24:12'),(2,'user','2025-08-04 09:55:38','2025-08-04 09:55:38'),(3,'mitra','2025-08-04 09:57:15','2025-08-05 13:47:05'),(5,'hacker','2025-08-05 14:16:42','2025-08-05 14:16:42');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Terminal`
--

DROP TABLE IF EXISTS `Terminal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Terminal` (
  `idTerminal` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idTerminal`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Terminal`
--

LOCK TABLES `Terminal` WRITE;
/*!40000 ALTER TABLE `Terminal` DISABLE KEYS */;
INSERT INTO `Terminal` VALUES (1,'Terminal Leuwi Pendek','2025-08-13 12:03:00','2025-08-13 12:04:26'),(2,'Terminal Leuwi Panjang','2025-08-17 10:41:13','2025-08-17 10:41:13');
/*!40000 ALTER TABLE `Terminal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `idRole` int NOT NULL,
  `idMitra` int DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `alamat` text,
  `telephone` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  KEY `fk_Users_Roles_idx` (`idRole`),
  KEY `fk_User_Mitra_idx` (`idMitra`),
  CONSTRAINT `fk_User_Mitra` FOREIGN KEY (`idMitra`) REFERENCES `Mitra` (`idMitra`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Users_Roles` FOREIGN KEY (`idRole`) REFERENCES `Role` (`idRole`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,1,NULL,'admin','jl. merdeka','333','admin@gmail.com','$2b$10$4v6v2aT1e7S/fdUEyAA0qezUCXWxQFph0WQ1Y8yHJJt5VVDCAuXRO','2025-08-06 16:05:23','2025-08-22 13:47:33'),(2,3,NULL,'mitra','jl. merdeka','777','mitra@gmail.com','$2b$10$R8fFykPHDwWtrNreCAJ0w.aho9gfKxAdjk/d4yC0sXhLKOPZ12bx2','2025-08-07 14:36:06','2025-08-22 13:12:01'),(4,5,NULL,'hacker','jl. merdeka','666','mitraa@gmail.com','$2b$10$x0PHp0ZpHhOsuxTCLm9f/OgGjCkzp3DMHdrQ34x3JPATHjh9rb1Gq','2025-08-09 13:19:16','2025-08-22 13:11:08');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodPayment`
--

DROP TABLE IF EXISTS `methodPayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodPayment` (
  `idmethodPayment` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idmethodPayment`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodPayment`
--

LOCK TABLES `methodPayment` WRITE;
/*!40000 ALTER TABLE `methodPayment` DISABLE KEYS */;
INSERT INTO `methodPayment` VALUES (1,'GOPAY',NULL,'2025-08-17 04:09:15','2025-08-17 04:14:43'),(2,'BCA',NULL,'2025-08-17 04:09:35','2025-08-17 04:09:35');
/*!40000 ALTER TABLE `methodPayment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-26  7:54:07
