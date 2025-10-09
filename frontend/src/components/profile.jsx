import React from "react";
// import { User, Phone, Mail, Settings, MessageCircle, Bell, Shield, HelpCircle, LogOut, Edit3, Camera } from "lucide-react";

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                        {/* <User className="w-16 h-16 text-white" /> */}
                                    </div>
                                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                        {/* <Camera className="w-5 h-5 text-white" /> */}
                                    </button>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
                                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                            {/* <Edit3 className="w-4 h-4 text-gray-500" /> */}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-green-600 font-medium">Online</span>
                                    </div>
                                    <p className="text-gray-600 text-sm px-4">Hey there! I'm using this messaging app and loving the experience.</p>
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Member since</span>
                                        <span className="text-gray-800">January 2025</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Last seen</span>
                                        <span className="text-gray-800">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Settings and Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
                                <p className="text-gray-600 text-sm">Update your contact details</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center">
                                        {/* <Phone className="w-5 h-5 text-gray-500 mr-4" /> */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Phone Number</p>
                                            <p className="text-gray-600">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                        {/* <Edit3 className="w-4 h-4 text-gray-500" /> */}
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center">
                                        {/* <Mail className="w-5 h-5 text-gray-500 mr-4" /> */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email Address</p>
                                            <p className="text-gray-600">john.doe@example.com</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                        {/* <Edit3 className="w-4 h-4 text-gray-500" /> */}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Settings</h3>
                                <p className="text-gray-600 text-sm">Customize your app experience</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="flex items-center p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                                        {/* <MessageCircle className="w-6 h-6 text-blue-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Chat Settings</p>
                                            <p className="text-sm text-gray-600">Manage chat preferences</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                                        {/* <Bell className="w-6 h-6 text-blue-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Notifications</p>
                                            <p className="text-sm text-gray-600">Control your alerts</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                                        {/* <Shield className="w-6 h-6 text-blue-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Privacy & Security</p>
                                            <p className="text-sm text-gray-600">Manage your privacy</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                                        {/* <Settings className="w-6 h-6 text-blue-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Account Settings</p>
                                            <p className="text-sm text-gray-600">Manage your account</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                                        {/* <HelpCircle className="w-6 h-6 text-blue-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">Help & Support</p>
                                            <p className="text-sm text-gray-600">Get help and support</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center p-4 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200">
                                        {/* <LogOut className="w-6 h-6 text-red-600 mr-4" /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-red-700">Log Out</p>
                                            <p className="text-sm text-red-600">Sign out of your account</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;