"use client"

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
  IconButton,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react"
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa"

const DoctorConsultationPage = () => {
  const navigate = useNavigate()

  const externalServices = [
    {
      name: "yokumiru",
      description: "24時間オンライン医療相談",
      url: "https://yokumiru.com",
      colorScheme: "brand",
    },
    {
      name: "海外部サービス",
      description: "海上労働者専門医療相談",
      url: "#",
      colorScheme: "green",
    },
  ]

  return (
    <Container maxW="md">
      <Box mt={8}>
        <Card>
          <CardHeader>
            <HStack spacing={3}>
              <IconButton icon={<FaArrowLeft />} variant="ghost" onClick={() => navigate("/menu")} />
              <Heading size="lg">ドクター相談</Heading>
            </HStack>
          </CardHeader>

          <CardBody>
            <VStack spacing={4}>
              <Text color="gray.600" textAlign="center" mb={6}>
                専門医による相談サービスをご利用いただけます
              </Text>

              {externalServices.map((service, index) => (
                <Button
                  key={index}
                  onClick={() => window.open(service.url, "_blank")}
                  colorScheme={service.colorScheme}
                  size="lg"
                  width="100%"
                  height="16"
                  justifyContent="space-between"
                  rightIcon={<FaExternalLinkAlt />}
                >
                  <VStack spacing={0} align="start">
                    <Text fontWeight="semibold">{service.name}</Text>
                    <Text fontSize="sm" opacity={0.9}>
                      {service.description}
                    </Text>
                  </VStack>
                </Button>
              ))}

              <Alert status="warning" mt={8}>
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">注意:</Text>
                  <Text fontSize="sm">
                    AI診断は参考情報です。緊急時や症状が重い場合は、すぐに医療機関を受診してください。
                  </Text>
                </VStack>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  )
}

export default DoctorConsultationPage
