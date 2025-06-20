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
  Text,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react"
import { FaArrowLeft, FaUsers, FaChartBar, FaActivity } from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersResponse, diagnosesResponse] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/diagnoses"),
      ])

      setUsers(usersResponse.data)
      setDiagnoses(diagnosesResponse.data)
    } catch (error) {
      console.error("データ読み込みエラー:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const todaysDiagnoses = diagnoses.filter(
    (d) => new Date(d.created_at).toDateString() === new Date().toDateString(),
  ).length

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  return (
    <Container maxW="6xl">
      <Box mt={8}>
        <Card mb={6}>
          <CardHeader>
            <HStack justify="space-between">
              <HStack spacing={3}>
                <IconButton icon={<FaArrowLeft />} variant="ghost" onClick={() => navigate("/menu")} />
                <Heading size="xl">管理者ダッシュボード</Heading>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                ようこそ、{user?.username}さん
              </Text>
            </HStack>
          </CardHeader>
        </Card>

        {/* 統計カード */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box p={3} bg="brand.100" borderRadius="lg">
                    <FaUsers color="var(--chakra-colors-brand-600)" size={24} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <StatLabel>総ユーザー数</StatLabel>
                    <StatNumber>{users.length}</StatNumber>
                  </VStack>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box p={3} bg="green.100" borderRadius="lg">
                    <FaActivity color="var(--chakra-colors-green-600)" size={24} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <StatLabel>総診断数</StatLabel>
                    <StatNumber>{diagnoses.length}</StatNumber>
                  </VStack>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Box p={3} bg="orange.100" borderRadius="lg">
                    <FaChartBar color="var(--chakra-colors-orange-600)" size={24} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <StatLabel>今日の診断数</StatLabel>
                    <StatNumber>{todaysDiagnoses}</StatNumber>
                  </VStack>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* タブコンテンツ */}
        <Tabs>
          <TabList>
            <Tab>ユーザー管理</Tab>
            <Tab>診断結果</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">ユーザー一覧</Heading>
                </CardHeader>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>ユーザー名</Th>
                          <Th>メール</Th>
                          <Th>役割</Th>
                          <Th>登録日</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {users.map((user) => (
                          <Tr key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.username}</Td>
                            <Td>{user.email}</Td>
                            <Td>
                              <Badge colorScheme={user.role === "admin" ? "purple" : "gray"}>{user.role}</Badge>
                            </Td>
                            <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">AI診断結果一覧</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    {diagnoses.map((diagnosis) => (
                      <Card key={diagnosis.id} w="100%" variant="outline">
                        <CardBody>
                          <HStack justify="space-between" mb={2}>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">ユーザー: {diagnosis.username}</Text>
                              <Text fontSize="sm" color="gray.600">
                                症状: {diagnosis.symptoms}
                              </Text>
                            </VStack>
                            <Badge colorScheme={getUrgencyColor(diagnosis.urgency_level)}>
                              {diagnosis.urgency_level}
                            </Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">診断: {diagnosis.diagnosis}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(diagnosis.created_at).toLocaleString()}
                            </Text>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default AdminDashboard
