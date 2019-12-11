//
//  AEFormat.hpp
//  Amaze
//
//  Created by 韩琼 on 16/2/5.
//  Copyright © 2016年 AppEngine. All rights reserved.
//

#ifndef AEFormat_hpp
#define AEFormat_hpp

#include "AEPlatform.hpp"


/** OpenGL-specific enums */
#define GL_BGR                      0x80E0


/** WebGL-specific enums */
#define GL_DEPTH_STENCIL                        GL_DEPTH_STENCIL_OES
#define GL_DEPTH_STENCIL_ATTACHMENT             0x821A
#define GL_UNPACK_FLIP_Y_WEBGL                  0x9240
#define GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL       0x9241
#define GL_CONTEXT_LOST_WEBGL                   0x9242
#define GL_UNPACK_COLORSPACE_CONVERSION_WEBGL   0x9243
#define GL_BROWSER_DEFAULT_WEBGL                0x9244


#if TARGET_OS_ANDROID

#define GL_RGB16F_EXT               0x881B
#define GL_RGBA16F_EXT              0x881A
#define GL_RGB32F_EXT               0x8815
#define GL_RGBA32F_EXT              0x8814
#define GL_BGRA                     GL_BGRA_EXT
#define GL_SRGB_EXT                 0x8C40
#define GL_SRGB_ALPHA_EXT           0x8C42
#define GL_ALPHA16F_EXT             0x881C
#define GL_LUMINANCE16F_EXT         0x881E
#define GL_LUMINANCE_ALPHA32F_EXT   0x8819
#define GL_ALPHA32F_EXT             0x8816
#define GL_LUMINANCE32F_EXT         0x8818
#define GL_LUMINANCE_ALPHA16F_EXT   0x881F

#endif


class AEFormat {
public:
	template<typename Func>
	static inline void split(const char* source, const char* token, Func func) {
		size_t length = strlen(source);
		char*  buffer = static_cast<char*>(calloc(length + 1, sizeof(char)));
		memcpy(buffer, source, length);

		uint  loop = 0;
		bool  stop = false;
		char* item = strtok(buffer, token);
		while(item && !stop) {
			func(loop, item, &stop);
			item = strtok(nullptr, token);
			loop++;
		}
		free(buffer);
	}

public:
	static GLuint digitWithChar(char c);
	static GLuint colorWith3Char(const char* text);
	static GLuint colorWith6Char(const char* text);
	static GLuint colorWithStyle(const char* style);
	static std::string styleWithColor(GLuint color);

	static GLfloat fontSizeWithStyle(const char* style);
	static std::string fontNameWithStyle(const char* style);
	static std::string styleWithFont(GLuint color);

public:
    static bool isPOT(GLsizei size);
    static bool extension(const char* name);
    static void getExtensions(std::vector<std::string>& extensions);
    
public:
    static bool formatIs16bpp(GLenum format);
    static bool formatIsFloat(GLenum fomrat);
    static bool formatIsHalfFloat(GLenum format);
    static bool formatHasAlpha(GLenum format);
    static bool formatHasColor(GLenum format);
    static bool texelComponent(GLenum format, GLenum type, GLuint* bytesPerComponent, GLuint* componentsPerPixel);
    
public:
    static GLuint texelSize(GLenum format);
    static GLenum texelFormat(GLenum format, GLenum type);
    static GLubyte* formatPixels(GLvoid* srcbuf, GLenum fmt, GLenum type, GLuint width, GLuint height, GLuint align, bool flipY, bool premAlpha);
    
public:
    /** Pixel unpacking routines. */
    static inline void unpackBGRToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[2];
        destination[1] = source[1];
        destination[2] = source[0];
        destination[3] = 0xFF;
    }
    static inline void unpackBGRAToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[2];
        destination[1] = source[1];
        destination[2] = source[0];
        destination[3] = source[3];
    }
    static inline void unpackRGBToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[1];
        destination[2] = source[2];
        destination[3] = 0xFF;
    }
    static inline void unpackRGBAToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[1];
        destination[2] = source[2];
        destination[3] = source[3];
    }
    static inline void unpackALPHAToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = 0x0;
        destination[1] = 0x0;
        destination[2] = 0x0;
        destination[3] = source[0];
    }
    static inline void unpackLUMINANCEToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[0];
        destination[2] = source[0];
        destination[3] = 0xFF;
    }
    static inline void unpackLUMINANCE_ALPHAToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[0];
        destination[2] = source[0];
        destination[3] = source[1];
    }
    static inline void unpackRGBA4ToRGBA(const GLushort* source, GLubyte* destination) {
        GLushort packedValue = source[0];
        GLubyte r = packedValue >> 12;
        GLubyte g = (packedValue >> 8) & 0x0F;
        GLubyte b = (packedValue >> 4) & 0x0F;
        GLubyte a = packedValue & 0x0F;
        destination[0] = r << 4 | r;
        destination[1] = g << 4 | g;
        destination[2] = b << 4 | b;
        destination[3] = a << 4 | a;
    }
    static inline void unpackRGB565ToRGBA(const GLushort* source, GLubyte* destination) {
        GLushort packedValue = source[0];
        GLubyte r = packedValue >> 11;
        GLubyte g = (packedValue >> 5) & 0x3F;
        GLubyte b = packedValue & 0x1F;
        destination[0] = (r << 3) | (r & 0x7);
        destination[1] = (g << 2) | (g & 0x3);
        destination[2] = (b << 3) | (b & 0x7);
        destination[3] = 0xFF;
    }
    static inline void unpackRGB5_A1ToRGBA(const GLushort* source, GLubyte* destination) {
        GLushort packedValue = source[0];
        GLubyte r = (packedValue >> 11);
        GLubyte g = (packedValue >> 6 ) & 0x1F;
        GLubyte b = (packedValue >> 1 ) & 0x1F;
        destination[0] = (r << 3) | (r & 0x7);
        destination[1] = (g << 3) | (g & 0x7);
        destination[2] = (b << 3) | (b & 0x7);
        destination[3] = (packedValue & 0x1) ? 0xFF : 0x0;
    }
    
    
    // RGBA_BGR
    static inline void packRGBAToBGR(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[2];
        destination[1] = source[1];
        destination[2] = source[0];
    }
    static inline void packRGBAToBGRUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<float>(source[2]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<float>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<float>(source[0]) * factor);
    }
    static inline void packRGBAToBGRPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
    }
    
    // RGBA_RGB
    static inline void packRGBAToRGB(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[1];
        destination[2] = source[2];
    }
    static inline void packRGBAToRGBUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<float>(source[0]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<float>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<float>(source[2]) * factor);
    }
    static inline void packRGBAToRGBPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
    }
    
    // RGBA_BGRA
    static inline void packRGBAToBGRA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[2];
        destination[1] = source[1];
        destination[2] = source[0];
        destination[3] = source[3];
    }
    static inline void packRGBAToBGRAUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<float>(source[2]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<float>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<float>(source[0]) * factor);
        destination[3] = source[3];
    }
    static inline void packRGBAToBGRAPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[3] = source[3];
    }
    
    // RGBA_RGBA
    static inline void packRGBAToRGBA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[1];
        destination[2] = source[2];
        destination[3] = source[3];
    }
    static inline void packRGBAToRGBAUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        destination[3] = source[3];
    }
    static inline void packRGBAToRGBAPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[1] = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        destination[2] = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        destination[3] = source[3];
    }
    
    // RGBA_ALPHA
    static inline void packRGBAToALPHA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[3];
    }
    static inline void packRGBAToALPHAUnmultiply(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[3];
    }
    static inline void packRGBAToALPHAPremultiply(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[3];
    }
    
    // RGBA_LUMINANCE
    static inline void packRGBAToLUMINANCE(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
    }
    static inline void packRGBAToLUMINANCEUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
    }
    static inline void packRGBAToLUMINANCEPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
    }
    
    // RGBA_LUMINANCE_ALPHA
    static inline void packRGBAToLUMINANCE_ALPHA(const GLubyte* source, GLubyte* destination) {
        destination[0] = source[0];
        destination[1] = source[3];
    }
    static inline void packRGBAToLUMINANCE_ALPHAUnmultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] ? 255.0f / source[3] : 1.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[1] = source[3];
    }
    static inline void packRGBAToLUMINANCE_ALPHAPremultiply(const GLubyte* source, GLubyte* destination) {
        GLfloat factor = source[3] / 255.0f;
        destination[0] = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        destination[1] = source[3];
    }
    
    // RGBA_RGBA4
    static inline void packRGBAToRGBA4(const GLubyte* source, GLushort* destination) {
        *destination = (((source[0] & 0xF0) << 8)
                        | ((source[1] & 0xF0) << 4)
                        | (source[2] & 0xF0)
                        | (source[3] >> 4));
    }
    static inline void packRGBAToRGBA4Unmultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] ? 255.0f / source[3] : 1.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF0) << 8)
                        | ((sourceG & 0xF0) << 4)
                        | (sourceB & 0xF0)
                        | (source[3] >> 4));
    }
    static inline void packRGBAToRGBA4Premultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] / 255.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF0) << 8)
                        | ((sourceG & 0xF0) << 4)
                        | (sourceB & 0xF0)
                        | (source[3] >> 4));
    }
    
    // RGBA_RGB565
    static inline void packRGBAToRGB565(const GLubyte* source, GLushort* destination) {
        *destination = (((source[0] & 0xF8) << 8)
                        | ((source[1] & 0xFC) << 3)
                        | ((source[2] & 0xF8) >> 3));
    }
    static inline void packRGBAToRGB565Unmultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] ? 255.0f / source[3] : 1.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF8) << 8)
                        | ((sourceG & 0xFC) << 3)
                        | ((sourceB & 0xF8) >> 3));
    }
    static inline void packRGBAToRGB565Premultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] / 255.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF8) << 8)
                        | ((sourceG & 0xFC) << 3)
                        | ((sourceB & 0xF8) >> 3));
    }
    
    // RGBA_RGB5_A1
    static inline void packRGBAToRGB5_A1(const GLubyte* source, GLushort* destination) {
        *destination = (((source[0] & 0xF8) << 8)
                        | ((source[1] & 0xF8) << 3)
                        | ((source[2] & 0xF8) >> 2)
                        | (source[3] >> 7));
    }
    static inline void packRGBAToRGB5_A1Unmultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] ? 255.0f / source[3] : 1.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF8) << 8)
                        | ((sourceG & 0xF8) << 3)
                        | ((sourceB & 0xF8) >> 2)
                        | (source[3] >> 7));
    }
    static inline void packRGBAToRGB5_A1Premultiply(const GLubyte* source, GLushort* destination) {
        GLfloat factor  = source[3] / 255.0f;
        GLubyte sourceR = static_cast<GLubyte>(static_cast<GLfloat>(source[0]) * factor);
        GLubyte sourceG = static_cast<GLubyte>(static_cast<GLfloat>(source[1]) * factor);
        GLubyte sourceB = static_cast<GLubyte>(static_cast<GLfloat>(source[2]) * factor);
        *destination = (((sourceR & 0xF8) << 8)
                        | ((sourceG & 0xF8) << 3)
                        | ((sourceB & 0xF8) >> 2)
                        | (source[3] >> 7));
    }
};

#endif /* AEFormat_hpp */
