import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Theagweb API',
      version: '1.0.0',
      description: '아주대학교 영자신문사 웹사이트',
    },
    servers: [
      {
        url: 'http://localhost:7000/',
        description: '로컬호스트 7000'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // 경로는 실제 파일 위치에 맞게 수정
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
