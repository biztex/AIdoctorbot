"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
} from "@chakra-ui/react"
import { FaArrowLeft, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa"

const DiagnosisResultPage = () => {
  const [diagnosis, setDiagnosis] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedDiagnosis = sessionStorage.getItem("lastDiagnosis")
    if (!savedDiagnosis) {
      navigate("/ai-consultation")
      return
    }
    setDiagnosis(JSON.parse(savedDiagnosis))
  }, [navigate])

  const getUrgencyColor = (level) => {
    switch (level) {
      case "レベル3":
        return "red"
      case "レベル2":
        return "orange"
      case "レベル1":
        return "green"
      default:
        return "gray"
    }
  }

  const getUrgencyIcon = (level) => {
    switch (level) {
      case "レベル3":
        return FaExclamationTriangle
      case "レベル2":
        return FaInfoCircle
      case "レベル1":
        return FaCheckCircle
      default:
        return FaInfoCircle
    }
  }

  if (!diagnosis) return <Box>読み込み中...</Box>

  const highestUrgency = diagnosis.diagnosis.reduce((prev, current) =>
    prev.urgency_level > current.urgency_level ? prev : current,
  )

  return (
    <Container maxW="2xl">
      <Box mt={8}>
        <Card>
          <CardHeader>
            <HStack spacing={3}>
              <IconButton icon={<FaArrowLeft />} variant="ghost" onClick={() => navigate("/ai-consultation")} />
              <Heading size="lg">緊急度判定</Heading>
            </HStack>
          </CardHeader>

          <CardBody>
            <VStack spacing={6}>
              {/* 緊急度レベル表示 */}
              <Box textAlign="center">
                <Badge
                  colorScheme={getUrgencyColor(highestUrgency.urgency_level)}
                  fontSize="2xl"
                  p={4}
                  borderRadius="lg"
                >
                  緊急{highestUrgency.urgency_level}
                </Badge>
                <Text mt={2} color="gray.600">
                  セルフドクターで検査しながら、医師相談をおすすめします
                </Text>
              </Box>

              {/* 診断結果一覧 */}
              <Box w="100%">
                <Heading size="md" mb={3}>
                  考えられる病名
                </Heading>
                <VStack spacing={3}>
                  {diagnosis.diagnosis.map((item, index) => (
                    <Card key={index} w="100%" p={4}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">{item.disease}</Text>
                        <Badge colorScheme={getUrgencyColor(item.urgency_level)}>{item.urgency_level}</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          可能性: {item.probability}%
                        </Text>
                        <Box w="24">
                          <Progress value={item.probability} colorScheme="brand" size="sm" borderRadius="full" />
                        </Box>
                      </HStack>
                    </Card>
                  ))}
                </VStack>
              </Box>

              {/* 病名と緊急レベル対比表 */}
              <Box w="100%">
                <Heading size="md" mb={3}>
                  病名と緊急レベル対比表（例）
                </Heading>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>レベル</Th>
                        <Th>病名</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <Badge colorScheme="red">レベル3</Badge>
                        </Td>
                        <Td fontSize="sm">
                          肺炎、急性腹膜炎、敗血症、髄膜炎、心筋炎、COVID-19（重症）、インフルエンザ脳症、呼吸不全、百日咳（重症化）、SARS/MERS
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Badge colorScheme="orange">レベル2</Badge>
                        </Td>
                        <Td fontSize="sm">
                          インフルエンザ、COVID-19（軽〜中等症）、マイコプラズマ肺炎、急性気管支炎、RSウイルス感染症、感染性胃腸炎、咽頭炎、扁桃結膜熱（咽頭結膜熱）
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Badge colorScheme="green">レベル1</Badge>
                        </Td>
                        <Td fontSize="sm">
                          かぜ（急性上気道炎）、アレルギー性鼻炎、咽頭アレルギー、皮膚炎、季節性アレルギー、軽度の脱水症状、嘔吐症、環境変化による体調不良、病的ストレス由来の発熱、ウイルス性胃腸炎（軽症）
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

              {/* アクションボタン */}
              <VStack spacing={3} w="100%">
                <Button onClick={() => navigate("/doctor-consultation")} colorScheme="red" size="lg" width="100%">
                  ドクター相談へ進む
                </Button>
                <Button onClick={() => navigate("/menu")} variant="outline" width="100%">
                  トップに戻る
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  )
}

export default DiagnosisResultPage
