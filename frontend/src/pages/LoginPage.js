"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Card,
  CardBody,
  CardHeader,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react"
import { useAuth } from "../contexts/AuthContext"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(credentials.username, credentials.password)

    if (result.success) {
      navigate("/menu")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <Container maxW="md" centerContent>
      <Box w="100%" mt={20}>
        <Card>
          <CardHeader textAlign="center">
            <Heading size="lg" color="brand.600">
              Maritime Smart Care360
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>ID</FormLabel>
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="ユーザーIDを入力"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="パスワードを入力"
                  />
                </FormControl>

                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <Button type="submit" colorScheme="brand" width="100%" isLoading={loading} loadingText="ログイン中...">
                  ログイン
                </Button>

                <Button variant="outline" width="100%">
                  新規登録
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginPage
