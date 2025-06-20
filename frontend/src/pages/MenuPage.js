"use client"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardBody, CardHeader, Heading, VStack, Button, Text, Box, Icon } from "@chakra-ui/react"
import { FaRobot, FaUserMd, FaSignOutAlt, FaCog } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"

const MenuPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Container maxW="md" centerContent>
      <Box w="100%" mt={8}>
        <Card>
          <CardHeader textAlign="center">
            <Heading size="lg" color="brand.600">
              Maritime Smart Care360
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={2}>
              ようこそ、{user?.username}さん
            </Text>
          </CardHeader>

          <CardBody>
            <VStack spacing={4}>
              {/* ドクターアイコン */}
              <Box
                w="32"
                h="32"
                bg="teal.100"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Icon as={FaRobot} w={16} h={16} color="teal.600" />
              </Box>

              <Button
                onClick={() => navigate("/ai-consultation")}
                colorScheme="brand"
                size="lg"
                width="100%"
                leftIcon={<FaRobot />}
              >
                AI問診
              </Button>

              <Button
                onClick={() => navigate("/doctor-consultation")}
                variant="outline"
                size="lg"
                width="100%"
                leftIcon={<FaUserMd />}
              >
                ドクター相談
              </Button>

              {user?.role === "admin" && (
                <Button
                  onClick={() => navigate("/admin")}
                  colorScheme="gray"
                  size="lg"
                  width="100%"
                  leftIcon={<FaCog />}
                >
                  管理者ダッシュボード
                </Button>
              )}

              <Button
                onClick={handleLogout}
                colorScheme="red"
                variant="outline"
                width="100%"
                leftIcon={<FaSignOutAlt />}
              >
                ログアウト
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  )
}

export default MenuPage
