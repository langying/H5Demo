//
//  AEFormat.cpp
//  Amaze
//
//  Created by 韩琼 on 16/2/5.
//  Copyright © 2016年 AppEngine. All rights reserved.
//

#include "AEFormat.hpp"

bool AEFindString(std::vector<std::string>& list, std::string item) {
    for (auto it = list.begin(); it != list.end(); it++) {
        if (*it == item) {
            return true;
        }
    }
    return false;
}

//#define _support(name) (std::find(extensions.begin(), extensions.end(), name) != extensions.end())
#define _support(name) AEFindString(extensions, name)

GLuint AEFormat::digitWithChar(char c) {
	GLuint v = toupper(c) - 0x30;
	return v <= 9 ? v : (v-7);
}
GLuint AEFormat::colorWith3Char(const char* text) {
	GLuint r = digitWithChar(text[0]);
	GLuint g = digitWithChar(text[1]);
	GLuint b = digitWithChar(text[2]);
	GLuint c = 0;
	c = c * 16 + r;
	c = c * 16 + r;
	c = c * 16 + g;
	c = c * 16 + g;
	c = c * 16 + b;
	c = c * 16 + b;
	return c;
}
GLuint AEFormat::colorWith6Char(const char* text) {
	GLuint c = 0;
	for (int i = 0; i < 6; i++) {
		c = c * 16 + digitWithChar(text[i]);
	}
	return c;
}
GLuint AEFormat::colorWithStyle(const char* buffer) {
	GLuint color = 0xFFFFFFFF;
	do {
		size_t length = strlen(buffer);
		if (length <= 0) {
			break;
		}
		if (buffer[0] != '#') {
			break;
		}
		switch (length) {
		case 4:
			color = colorWith3Char(buffer + 1);
			break;
		case 7:
			color = colorWith6Char(buffer + 1);
			break;
		}
	} while(0);
	return color;
}
std::string AEFormat::styleWithColor(GLuint color) {
	char text[16] = { 0 };
	sprintf(text, "0x%X", color);
	return text;
}
GLfloat AEFormat::fontSizeWithStyle(const char* style) {
	GLfloat size = 0;
	split(style, " ", [&](uint idx, char* item, bool* stop) {
		size_t len = strlen(item);
		if (len <= 0 || !isdigit(item[0])) {
			return;
		}
		for (size_t i = 0; i < len && isdigit(item[i]); i++) {
			size = size * 10 + (item[i] - '0');
		}
		*stop = true;
	});
	return size ?: 16;
}
std::string AEFormat::fontNameWithStyle(const char* style) {
	std::string name = "";
	split(style, " ", [&](uint idx, char* item, bool* stop) {
		if (isdigit(item[0])) {
			return;
		}
		name  = item;
		*stop = true;
	});
	return name;
}

bool AEFormat::isPOT(GLsizei size) {
    return (size & (size-1)) == 0;
}

bool AEFormat::extension(const char* text) {
    static std::vector<std::string> extensions;
    getExtensions(extensions);
    
    bool success = false;
    std::string name = text;
    if (name == "ANGLE_framebuffer_blit") {
        success = _support("GL_EXT_framebuffer_blit");
    }
    else if (name == "ANGLE_framebuffer_multisample") {
        success = _support("GL_EXT_framebuffer_multisample");
    }
    else if (name == "ANGLE_instanced_arrays") {
        success = (_support("GL_ARB_instanced_arrays") || _support("GL_EXT_instanced_arrays"))
        &&(_support("GL_ARB_draw_instanced")   || _support("GL_EXT_draw_instanced"));
    }
    else if (name == "EXT_sRGB") {
#if TARGET_OS_IOS
        success = _support("GL_EXT_sRGB");
#else
        success =  _support("GL_EXT_texture_sRGB")
        &&(_support("GL_EXT_framebuffer_sRGB") || _support("GL_ARB_framebuffer_sRGB"));
#endif
    }
    else if (name == "EXT_frag_depth") {
        success = _support("GL_EXT_frag_depth");
    }
    else if (name == "OES_rgb8_rgba8") {
        success = true;
    }
    else if (name == "OES_texture_float" || name == "OES_texture_half_float" || name == "OES_texture_float_linear" || name == "OES_texture_half_float_linear") {
        success = _support("GL_ARB_texture_float") || _support("GL_OES_texture_float");
    }
    else if (name == "OES_vertex_array_object") {
        success = _support("GL_ARB_vertex_array_object") || _support("GL_OES_vertex_array_object") || _support("GL_APPLE_vertex_array_object");
    }
    else if (name == "OES_standard_derivatives") {
        success = true;
    }
    else if (name == "OES_element_index_uint") {
        success = true;
    }
    else if (name == "EXT_shader_texture_lod") {
        success = _support("GL_EXT_shader_texture_lod");
    }
    else if (name == "EXT_texture_filter_anisotropic") {
        success = _support("GL_EXT_texture_filter_anisotropic");
    }
    else if (name == "EXT_draw_buffers") {
        success = _support("GL_EXT_draw_buffers") || _support("GL_ARB_draw_buffers");
    }
    else if (name == "EXT_packed_depth_stencil") {
        success = _support("GL_OES_packed_depth_stencil") || _support("GL_EXT_packed_depth_stencil");
    }
    else if (name == "WEBGL_compressed_texture_s3tc") {
        success =  _support("GL_EXT_texture_compression_s3tc")
        ||(_support("GL_EXT_texture_compression_dxt1") && _support("GL_CHROMIUM_texture_compression_dxt3") && _support("GL_CHROMIUM_texture_compression_dxt5"));
    }
    else if (name == "WEBKIT_WEBGL_compressed_texture_atc") {
        success = _support("GL_AMD_compressed_ATC_texture");
    }
    else if (name == "WEBGL_compressed_texture_pvrtc") {
        success = _support("GL_IMG_texture_compression_pvrtc");
    }
    else if (name == "WEBGL_depth_texture") {
        success = _support("GL_OES_depth_texture") || _support("GL_ARB_depth_texture") || _support("GL_CHROMIUM_depth_texture");
    }
    else if (name == "WEBGL_debug_shaders") {
        success = _support("GL_ANGLE_translated_shader_source");
    }
    else {
        success = _support(("GL_" + name));
    }
    return success;
}

void AEFormat::getExtensions(std::vector<std::string>& extensions) {
    if (extensions.size()) {
        return;
    }
    std::string splite = " ";
    std::string source = reinterpret_cast<const char*>(glGetString(GL_EXTENSIONS));
    std::string::size_type postion1 = 0;
    std::string::size_type postion2 = source.find(splite);
    while (postion2 != std::string::npos) {
        extensions.push_back(source.substr(postion1, postion2 - postion1));
        postion1 = postion2 + splite.size();
        postion2 = source.find(splite, postion1);
    }
    if (postion1 != source.length()) {
        extensions.push_back(source.substr(postion1));
    }
}

bool AEFormat::formatIs16bpp(GLenum format) {
    return format == GL_RGBA4
    || format == GL_RGB565
    || format == GL_RGB5_A1;
}
bool AEFormat::formatIsFloat(GLenum fomrat) {
    return fomrat == GL_RGB32F_EXT
    || fomrat == GL_RGBA32F_EXT
    || fomrat == GL_ALPHA32F_EXT
    || fomrat == GL_LUMINANCE32F_EXT
    || fomrat == GL_LUMINANCE_ALPHA32F_EXT;
}
bool AEFormat::formatIsHalfFloat(GLenum format) {
    return format == GL_RGB16F_EXT
    || format == GL_RGBA16F_EXT
    || format == GL_ALPHA32F_EXT
    || format == GL_LUMINANCE16F_EXT
    || format == GL_LUMINANCE_ALPHA16F_EXT;
}
bool AEFormat::formatHasAlpha(GLenum format) {
    return format == GL_ALPHA
    || format == GL_ALPHA16F_EXT
    || format == GL_ALPHA32F_EXT
    || format == GL_BGRA
    || format == GL_BGRA_EXT
    || format == GL_LUMINANCE_ALPHA
    || format == GL_LUMINANCE_ALPHA16F_EXT
    || format == GL_LUMINANCE_ALPHA32F_EXT
    || format == GL_RGBA
    || format == GL_RGBA4
    || format == GL_RGB5_A1
    || format == GL_RGBA16F_EXT
    || format == GL_RGBA32F_EXT
    || format == GL_SRGB_ALPHA_EXT;
}
bool AEFormat::formatHasColor(GLenum format) {
    return format == GL_RGB
    || format == GL_RGB16F_EXT
    || format == GL_RGB32F_EXT
    || format == GL_RGBA
    || format == GL_RGBA16F_EXT
    || format == GL_RGBA32F_EXT
    || format == GL_BGRA
    || format == GL_RGBA4
    || format == GL_RGB565
    || format == GL_RGB5_A1
    || format == GL_SRGB_EXT
    || format == GL_SRGB_ALPHA_EXT
    || format == GL_LUMINANCE
    || format == GL_LUMINANCE16F_EXT
    || format == GL_LUMINANCE32F_EXT
    || format == GL_LUMINANCE_ALPHA
    || format == GL_LUMINANCE_ALPHA16F_EXT
    || format == GL_LUMINANCE_ALPHA32F_EXT;
}
bool AEFormat::texelComponent(GLenum format, GLenum type, GLuint* bytesPerComponent, GLuint* componentsPerPixel) {
    switch (format) {
        case GL_ALPHA:
        case GL_LUMINANCE:
        case GL_DEPTH_STENCIL:
        case GL_DEPTH_COMPONENT: {
            *componentsPerPixel = 1;
            break;
        }
        case GL_LUMINANCE_ALPHA: {
            *componentsPerPixel = 2;
            break;
        }
        case GL_RGB:
        case GL_SRGB_EXT: {
            *componentsPerPixel = 3;
            break;
        }
        case GL_RGBA:
        case GL_BGRA_EXT:
        case GL_SRGB_ALPHA_EXT: {
            *componentsPerPixel = 4;
            break;
        }
        default: {
            return false;
        }
    }
    switch (type) {
        case GL_UNSIGNED_BYTE: {
            *bytesPerComponent = sizeof(GLubyte);
            break;
        }
        case GL_UNSIGNED_SHORT: {
            *bytesPerComponent = sizeof(GLushort);
            break;
        }
        case GL_UNSIGNED_SHORT_5_6_5:
        case GL_UNSIGNED_SHORT_5_5_5_1:
        case GL_UNSIGNED_SHORT_4_4_4_4: {
            *componentsPerPixel = 1;
            *bytesPerComponent = sizeof(GLushort);
            break;
        }
        case GL_UNSIGNED_INT:
        case GL_UNSIGNED_INT_24_8_OES: {
            *bytesPerComponent = sizeof(GLuint);
            break;
        }
        case GL_FLOAT: {
            *bytesPerComponent = sizeof(GLfloat);
            break;
        }
        case GL_HALF_FLOAT_OES: {
            *bytesPerComponent = sizeof(GLushort);
            break;
        }
        default: {
            return false;
        }
    }
    return true;
}
GLuint AEFormat::texelSize(GLenum format) {
    switch (format) {
        case GL_ALPHA:
        case GL_LUMINANCE: {
            return 1;
        }
        case GL_RGBA4:
        case GL_RGB565:
        case GL_RGB5_A1:
        case GL_ALPHA16F_EXT:
        case GL_LUMINANCE16F_EXT:
        case GL_LUMINANCE_ALPHA: {
            return 2;
        }
        case GL_RGB: {
            return 3;
        }
        case GL_RGBA:
        case GL_ALPHA32F_EXT:
        case GL_LUMINANCE32F_EXT:
        case GL_LUMINANCE_ALPHA16F_EXT: {
            return 4;
        }
        case GL_RGB16F_EXT: {
            return 6;
        }
        case GL_RGBA16F_EXT:
        case GL_LUMINANCE_ALPHA32F_EXT: {
            return 8;
        }
        case GL_RGB32F_EXT: {
            return 12;
        }
        case GL_RGBA32F_EXT: {
            return 16;
        }
        default: {
            return 0;
        }
    }
}
GLenum AEFormat::texelFormat(GLenum format, GLenum type) {
    GLenum dstfmt = 0;
    switch (type) {
        case GL_UNSIGNED_SHORT_5_6_5: {
            dstfmt = GL_RGB565;
            break;
        }
        case GL_UNSIGNED_SHORT_5_5_5_1: {
            dstfmt = GL_RGB5_A1;
            break;
        }
        case GL_UNSIGNED_SHORT_4_4_4_4: {
            dstfmt = GL_RGBA4;
            break;
        }
        case GL_UNSIGNED_BYTE: {
            switch (format) {
                case GL_RGB: {
                    dstfmt = GL_RGB;
                    break;
                }
                case GL_RGBA: {
                    dstfmt = GL_RGBA;
                    break;
                }
                case GL_ALPHA: {
                    dstfmt = GL_ALPHA;
                    break;
                }
                case GL_LUMINANCE: {
                    dstfmt = GL_LUMINANCE;
                    break;
                }
                case GL_LUMINANCE_ALPHA: {
                    dstfmt = GL_LUMINANCE_ALPHA;
                    break;
                }
            }
            break;
        }
        case GL_FLOAT: {
            switch (format) { // OES_texture_float
                case GL_RGB: {
                    dstfmt = GL_RGB32F_EXT;
                    break;
                }
                case GL_RGBA: {
                    dstfmt = GL_RGBA32F_EXT;
                    break;
                }
                case GL_ALPHA: {
                    dstfmt = GL_ALPHA32F_EXT;
                    break;
                }
                case GL_LUMINANCE: {
                    dstfmt = GL_LUMINANCE32F_EXT;
                    break;
                }
                case GL_LUMINANCE_ALPHA: {
                    dstfmt = GL_LUMINANCE_ALPHA32F_EXT;
                    break;
                }
            }
            break;
        }
        case GL_HALF_FLOAT_OES: { // OES_texture_half_float
            switch (format) {
                case GL_RGB: {
                    dstfmt = GL_RGB16F_EXT;
                    break;
                }
                case GL_RGBA: {
                    dstfmt = GL_RGBA16F_EXT;
                    break;
                }
                case GL_ALPHA: {
                    dstfmt = GL_ALPHA16F_EXT;
                    break;
                }
                case GL_LUMINANCE: {
                    dstfmt = GL_LUMINANCE16F_EXT;
                    break;
                }
                case GL_LUMINANCE_ALPHA: {
                    dstfmt = GL_LUMINANCE_ALPHA16F_EXT;
                    break;
                }
            }
            break;
        }
    }
    return dstfmt;
}

#define CASE_FORMAT(bytes, type, format); \
case GL_##format: {\
    GLuint   dststp = width * bytes;\
    GLuint   srcstp = ((dststp + align - 1) / align) * align;\
    GLubyte* buffer = static_cast<GLubyte*>(malloc(width * height * bytes));\
    for(GLuint srcrow = 0; srcrow < height; srcrow++) {\
        GLuint dstrow = flip ? (height - 1 - srcrow) : srcrow;\
        GLubyte* dstptr = buffer + dstrow * dststp;\
        GLubyte* srcptr = pixels + srcrow * srcstp;\
        for (GLuint i = 0; i < width; i++) {\
            unpack##format##ToRGBA(reinterpret_cast<type*>(srcptr), texels);\
            if (premAlpha) { \
                packRGBATo##format##Premultiply(texels, reinterpret_cast<type*>(srcptr));\
            }\
            else {\
                packRGBATo##format(texels, reinterpret_cast<type*>(srcptr));\
            }\
            srcptr += bytes;\
            dstptr += bytes;\
        }\
    }\
    return buffer;\
}
GLubyte* AEFormat::formatPixels(GLvoid* srcbuf, GLenum fmt, GLenum type, GLuint width, GLuint height, GLuint align, bool flip, bool premAlpha) {
    GLubyte texels[4];
    GLenum  format  = texelFormat(fmt, type);
    GLubyte *pixels = static_cast<GLubyte*>(srcbuf);
    switch (format) {
            CASE_FORMAT(3, GLubyte,  BGR);
            CASE_FORMAT(3, GLubyte,  RGB);
            CASE_FORMAT(4, GLubyte,  BGRA);
            CASE_FORMAT(4, GLubyte,  RGBA);
            CASE_FORMAT(1, GLubyte,  ALPHA);
            CASE_FORMAT(1, GLubyte,  LUMINANCE);
            CASE_FORMAT(2, GLubyte,  LUMINANCE_ALPHA);
            CASE_FORMAT(2, GLushort, RGBA4);
            CASE_FORMAT(2, GLushort, RGB565);
            CASE_FORMAT(2, GLushort, RGB5_A1);
        default: {
            return nullptr;
        }
    }
}
