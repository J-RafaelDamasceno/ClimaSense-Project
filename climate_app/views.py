from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ClimateData
from .serializers import ClimateDataSerializer

# View para exibir a temperatura (GET)
class TemperatureView(APIView):
    def get(self, request):
        # Exemplo de valor - Aqui você poderia pegar o valor da temperatura do banco
        temperature = 25.0
        return Response({'temperature': temperature}, status=status.HTTP_200_OK)

# View para exibir a umidade (GET)
class HumidityView(APIView):
    def get(self, request):
        # Exemplo de valor - Aqui você poderia pegar o valor da umidade do banco
        humidity = 60.0
        return Response({'humidity': humidity}, status=status.HTTP_200_OK)

# View para salvar dados de clima (POST)
class ClimateDataView(APIView):
    def post(self, request):
        # Passa os dados recebidos para o serializador
        serializer = ClimateDataSerializer(data=request.data)

        # Verifica se os dados são válidos
        if serializer.is_valid():
            # Salva os dados no banco de dados
            serializer.save()
            # Retorna uma resposta com os dados salvos e o status 201 (created)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Se os dados não forem válidos, retorna um erro com status 400
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
